import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import OpenAI from 'openai';
import sanitizeHtml from 'sanitize-html';
import { setupAuth, isAuthenticated, getFrontendOrigin } from './server/replitAuth.js';
import { storage } from './server/storage.js';
import { pool } from './server/db.js';
import { logger } from './utils/logger.js';
import { exportNoteToGoogleDrive } from './server/googleDrive.js';

// In-memory rate limiter
// NOTE: In Autoscale deployments, each instance maintains its own rate limit store.
// Rate limits are per-instance, not shared across instances. For shared rate limiting
// across all instances, consider implementing database-backed rate limiting.
const rateLimitStore = new Map();
const MAX_STORE_SIZE = 10000; // Prevent unbounded memory growth

function rateLimit(maxRequests: number, windowMs: number): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Aggressive cleanup: if store is getting too large, clean expired entries immediately
    if (rateLimitStore.size >= MAX_STORE_SIZE * 0.9) { // 90% threshold
      const cutoff = now - windowMs;
      for (const [k, requests] of rateLimitStore.entries()) {
        const validRequests = requests.filter(time => time > cutoff);
        if (validRequests.length === 0) {
          rateLimitStore.delete(k);
        } else {
          rateLimitStore.set(k, validRequests);
        }
      }
    }

    if (!rateLimitStore.has(key)) {
      // If still at capacity after cleanup, use LRU eviction
      if (rateLimitStore.size >= MAX_STORE_SIZE) {
        // Find and remove the least recently used entry (oldest timestamp)
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [k, requests] of rateLimitStore.entries()) {
          if (requests.length > 0 && requests[requests.length - 1] < oldestTime) {
            oldestTime = requests[requests.length - 1];
            oldestKey = k;
          }
        }
        if (oldestKey) {
          rateLimitStore.delete(oldestKey);
        }
      }
      rateLimitStore.set(key, []);
    }

    const requests = rateLimitStore.get(key);
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    validRequests.push(now);
    rateLimitStore.set(key, validRequests);

    // Note: Entries with empty validRequests will be cleaned up by the periodic cleanup interval
    // This ensures memory efficiency without per-request cleanup
    next();
  };
}

// Periodic cleanup of rate limit store to prevent memory leaks
const cleanupInterval = setInterval(() => {
  try {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    const cutoff = now - maxAge;

    for (const [key, requests] of rateLimitStore.entries()) {
      const validRequests = requests.filter(time => time > cutoff);
      if (validRequests.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, validRequests);
      }
    }
  } catch (error) {
    logger.error('Error in rate limiter cleanup', error);
  }
}, 15 * 60 * 1000); // Run cleanup every 15 minutes (more frequent for Autoscale)

// Cleanup function for graceful shutdown
function cleanupRateLimiter() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  rateLimitStore.clear();
}

// Graceful shutdown handlers - ensure cleanup runs in all scenarios
process.on('SIGTERM', () => {
  cleanupRateLimiter();
  process.exit(0);
});

process.on('SIGINT', () => {
  cleanupRateLimiter();
  process.exit(0);
});

process.on('exit', () => {
  cleanupRateLimiter();
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  cleanupRateLimiter();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { promise, reason });
  // Don't exit on unhandled rejection, but log it
});

// Check for XAI API key but don't exit - allow graceful degradation for local dev
if (!process.env.XAI_API_KEY) {
  logger.warn('XAI_API_KEY environment variable is not set. AI features will be disabled.');
}

const app: Application = express();
const PORT = 3001;

// Determine if we're in production (Replit production or explicit NODE_ENV)
function isProductionEnvironment() {
  // Check for Replit production domain (published apps)
  if (process.env.REPLIT_DOMAINS && !process.env.REPLIT_DEV_DOMAIN) {
    return true;
  }
  // Check explicit NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  return false;
}

// Get all allowed origins for CORS in production
function getAllowedOrigins() {
  if (isProductionEnvironment()) {
    // In production, allow all domains from REPLIT_DOMAINS
    if (process.env.REPLIT_DOMAINS) {
      return process.env.REPLIT_DOMAINS.split(',')
        .map(domain => `https://${domain.trim()}`)
        .filter(url => url.length > 8); // Filter out empty/invalid entries
    }
    // Fallback to single origin
    return [getFrontendOrigin()];
  }
  return ['http://localhost:5000', 'http://127.0.0.1:5000'];
}

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true
};

app.use(cors(corsOptions));

// Cookie parser for CSRF tokens
app.use(cookieParser());


// CSRF Protection Middleware (Double-Submit Cookie Pattern)
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware to set CSRF token cookie
app.use((req, res, next) => {
  if (!req.cookies['csrf-token']) {
    const token = generateCsrfToken();
    res.cookie('csrf-token', token, {
      httpOnly: false, // Client needs to read this
      secure: isProductionEnvironment(),
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  next();
});

// CSRF validation for state-changing requests
function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF for GET, HEAD, OPTIONS requests (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      code: 'CSRF_INVALID',
    });
  }

  next();
}

// Response compression (gzip/brotli) - compress JSON responses and static assets
// Filter function to skip compression for very small responses (not worth CPU cost)
app.use(compression({
  filter: (req, res) => {
    // Don't compress responses if compression is disabled or response is very small
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  },
  level: 6, // Balance between compression ratio and CPU usage (0-9, 6 is good default)
  threshold: 1024, // Only compress responses larger than 1KB
}));

app.use(express.json({ limit: '10mb' })); // Add payload size limit

// Caching headers middleware
app.use((req, res, next) => {
  // Set no-cache for API endpoints that require fresh data
  if (req.path.startsWith('/api')) {
    // API endpoints should not be cached by default
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  // Static assets will get cache headers from express.static configuration
  next();
});

// Input validation middleware
function validateInput(req: Request, res: Response, next: NextFunction): void {
  // Sanitize string inputs using sanitize-html library
  const sanitizeString = (str, maxLength = 1000) => {
    if (typeof str !== 'string') return '';
    // Use sanitize-html with strict settings - strip all HTML tags
    const cleaned = sanitizeHtml(str, {
      allowedTags: [], // No HTML tags allowed
      allowedAttributes: {}, // No attributes allowed
      disallowedTagsMode: 'discard', // Remove disallowed tags entirely
    });
    return cleaned.trim().substring(0, maxLength);
  };

  // Validate topic parameter for poetry examples
  if (req.body && req.body.topic) {
    req.body.topic = sanitizeString(req.body.topic, 200); // Max 200 chars for topic
    if (!req.body.topic || req.body.topic.length < 2) {
      return res.status(400).json({ error: 'Topic must be at least 2 characters long' });
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\b(script|javascript|vbscript|onload|onerror)\b/i,
    /<[^>]*>/,
    /javascript:/i,
    /data:text/i
  ];

  const checkForSuspiciousContent = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(obj[key])) {
            // Send response and return true to indicate response was sent
            res.status(400).json({ error: 'Invalid input detected' });
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively check nested objects and propagate result
        const recursiveResult = checkForSuspiciousContent(obj[key]);
        if (recursiveResult) {
          return recursiveResult;
        }
      }
    }
    return false; // No suspicious content found
  };

  if (req.body) {
    const checkResult = checkForSuspiciousContent(req.body);
    // If suspicious content was found, response was already sent - don't call next()
    if (checkResult) {
      return; // Short-circuit: response already sent, don't call next()
    }
  }

  next();
}

// Apply input validation to API routes
app.use('/api', validateInput);

// Setup authentication (must be done before routes)
await setupAuth(app);

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY
});

app.get('/api/sancho-quote', rateLimit(5, 60000), async (req, res) => { // 5 requests per minute
  try {
    if (!process.env.XAI_API_KEY) {
      return res.status(503).json({
        error: 'AI features are temporarily disabled. Sancho quotes are available from our curated collection.',
        retryAfter: 0,
        fallbackAvailable: true
      });
    }

    // Generate a random seed to encourage variety
    const randomSeed = Math.floor(Math.random() * 10000);
    const partPreference = Math.random() > 0.5 ? 'Part I' : 'Part II';
    const chapterRange = Math.floor(Math.random() * 74) + 1;
    
    const prompt = `Provide a single quote from Sancho Panza from "Don Quixote" by Miguel de Cervantes.

CRITICAL REQUIREMENTS:
- The quote MUST be in ENGLISH only - never in Spanish
- Use the Edith Grossman English translation if possible (published 2003)
- If exact Grossman wording is unknown, provide an accurate English translation that captures the spirit of her acclaimed translation style
- Quote must be genuinely from Don Quixote with accurate chapter/part reference

VARIETY REQUIREMENT (seed: ${randomSeed}):
- Explore ${partPreference}, around chapter ${chapterRange} or nearby
- Avoid these commonly quoted lines: "whether the stone hits the pitcher", "the proof of the pudding", "time ripens all things"
- Find lesser-known gems that showcase Sancho's wit, proverbs, or practical wisdom

Quote should reflect Sancho's personality: earthy humor, folk wisdom, loyalty, or philosophical observations.

Respond with JSON: { "quote": "the English quote text", "context": "Part X, Chapter Y - brief situation context" }`;

    const response = await openai.chat.completions.create({
      model: "grok-4-1-fast-non-reasoning",
      messages: [
        {
          role: "system",
          content: "You are a literature expert specializing in Miguel de Cervantes' Don Quixote. You must ALWAYS respond in ENGLISH only - never use Spanish text. When possible, quote from Edith Grossman's celebrated 2003 English translation, known for its clarity and faithfulness to Cervantes' humor. If the exact Grossman wording is unavailable, provide an accurate English translation in her accessible, witty style. Always include accurate chapter/part references."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.95, // High temperature for maximum variety
      max_tokens: 200
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No response from AI service');
    }

    const jsonText = response.choices[0].message.content;
    let parsedJson;

    try {
      parsedJson = JSON.parse(jsonText);
    } catch (parseError) {
      logger.error('Failed to parse AI response as JSON', { jsonText, parseError });
      throw new Error('Invalid response format from AI service');
    }

    // Validate the response structure
    if (!parsedJson.quote || typeof parsedJson.quote !== 'string') {
      logger.error('AI service did not return a valid quote', { response: parsedJson });
      throw new Error('AI service did not return a valid quote');
    }

    // Trim whitespace and normalize quote
    parsedJson.quote = parsedJson.quote.trim();
    if (parsedJson.context) {
      parsedJson.context = parsedJson.context.trim();
    }

    res.json(parsedJson);
  } catch (error) {
    logger.error("Error fetching Sancho quote from XAI", error);

    // Check error status before sending response
    // Specific rate limiting error (from express-rate-limit middleware)
    if (error.message?.includes('Too many requests') || error.status === 429) {
      return res.status(429).json({
        error: 'Quote generation limit reached. Please wait a moment before requesting another quote.',
        retryAfter: 60,
        fallbackAvailable: true
      });
    }

    // AI service errors
    if (error.message?.includes('API key') || error.status === 401) {
      return res.status(503).json({
        error: 'AI quote service is temporarily unavailable.',
        retryAfter: 300,
        fallbackAvailable: true
      });
    }

    // General server errors
    res.status(500).json({
      error: "Quote service temporarily unavailable",
      retryAfter: 60,
      fallbackAvailable: true,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/poetry-learn-more', rateLimit(10, 60000), async (req, res) => { // 10 requests per minute
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(503).json({
        error: 'AI features are currently disabled. Please configure XAI_API_KEY to enable learn more context.'
      });
    }

    const prompt = `Provide a concise historical and cultural context paragraph about ${topic} in poetry. The paragraph should be 2-4 sentences and cover: (1) historical origins and evolution of this poetic form/device/meter, (2) its cultural and literary significance, and (3) key historical periods or movements associated with it. Use a scholarly but accessible tone. Respond with JSON in this format: { "context": "the paragraph text" }`;

    const response = await openai.chat.completions.create({
      model: "grok-4-1-fast-non-reasoning",
      messages: [
        {
          role: "system",
          content: "You are a poetry and literature expert specializing in historical and cultural context. Provide accurate, scholarly information about poetic forms, devices, and meters, focusing on their historical origins, evolution, and cultural significance. Always respond with a well-structured paragraph of 2-4 sentences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.35,
    });

    const jsonText = response.choices[0].message.content || "{}";
    const parsedJson = JSON.parse(jsonText);
    
    res.json(parsedJson);
  } catch (error) {
    logger.error("Error fetching learn more context from XAI", error);
    res.status(500).json({ 
      error: "Failed to generate context. The model may be unavailable or the request could not be fulfilled.",
      details: error.message 
    });
  }
});

// Auth route to get current user - publicly accessible for auth status polling
app.get('/api/auth/user', async (req, res) => {
  try {
    // Check if user is authenticated via session
    if (req.isAuthenticated() && req.user && req.user.claims) {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user) {
        return res.json({ authenticated: true, user });
      }
    }
    
    // Not authenticated
    return res.json({ authenticated: false, user: null });
  } catch (error) {
    logger.error("Error fetching user", error);
    return res.status(500).json({ authenticated: false, error: "Failed to fetch user" });
  }
});

// Pinned items routes - require authentication
app.get('/api/pinned-items', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const items = await storage.getPinnedItems(userId);
    res.json({ items: items.map(item => item.itemData) });
  } catch (error) {
    logger.error("Error fetching pinned items", error);
    res.status(500).json({ error: "Failed to fetch pinned items" });
  }
});

app.post('/api/pinned-items', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { itemData } = req.body;

    // Enhanced validation for itemData structure
    if (!itemData || typeof itemData !== 'object') {
      return res.status(400).json({ error: "Invalid item data: must be an object" });
    }

    if (!itemData.name || typeof itemData.name !== 'string' || itemData.name.trim().length === 0) {
      return res.status(400).json({ error: "Invalid item data: name is required and must be a non-empty string" });
    }

    // Validate itemData doesn't contain circular references or invalid types
    try {
      JSON.stringify(itemData);
    } catch (jsonError) {
      return res.status(400).json({ error: "Invalid item data: contains invalid structure" });
    }

    const pinned = await storage.pinItem(userId, itemData);
    res.json({ item: pinned.itemData });
  } catch (error) {
    logger.error("Error pinning item", error);
    // Provide more detailed error information
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    const statusCode = error?.code === '23505' ? 409 : 500; // 409 Conflict for unique constraint violations
    res.status(statusCode).json({ 
      error: statusCode === 409 
        ? "This item is already in your notebook" 
        : `Failed to pin item: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

app.delete('/api/pinned-items/:itemName', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { itemName } = req.params;

    if (!itemName) {
      return res.status(400).json({ error: "Item name is required" });
    }

    await storage.unpinItem(userId, decodeURIComponent(itemName));
    res.json({ success: true });
  } catch (error) {
    logger.error("Error unpinning item", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    res.status(500).json({ 
      error: `Failed to unpin item: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Journal entries routes - require authentication
app.get('/api/journal', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const entries = await storage.getJournalEntries(userId);
    res.json({ entries });
  } catch (error) {
    logger.error("Error fetching journal entries", error);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

app.post('/api/journal', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { id, title, content, templateRef, tags, isStarred } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Entry ID is required" });
    }

    const entry = await storage.createJournalEntry(userId, {
      id,
      title: title || '',
      content: content || '',
      templateRef,
      tags: tags || [],
      isStarred: isStarred || false,
    });
    res.json({ entry });
  } catch (error) {
    logger.error("Error creating journal entry", error);
    const statusCode = error?.code === '23505' ? 409 : 500;
    res.status(statusCode).json({ 
      error: statusCode === 409 ? "Entry already exists" : "Failed to create journal entry"
    });
  }
});

app.patch('/api/journal/:id', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { id } = req.params;
    const { title, content, templateRef, tags, isStarred } = req.body;

    const entry = await storage.updateJournalEntry(userId, id, {
      title,
      content,
      templateRef,
      tags,
      isStarred,
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({ entry });
  } catch (error) {
    logger.error("Error updating journal entry", error);
    res.status(500).json({ error: "Failed to update journal entry" });
  }
});

app.delete('/api/journal/:id', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { id } = req.params;

    const deleted = await storage.deleteJournalEntry(userId, id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error("Error deleting journal entry", error);
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
});

app.post('/api/journal/migrate', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { entries } = req.body;

    if (!Array.isArray(entries)) {
      return res.status(400).json({ error: "Entries must be an array" });
    }

    const created = await storage.bulkCreateJournalEntries(userId, entries);
    res.json({ migrated: created.length, entries: created });
  } catch (error) {
    logger.error("Error migrating journal entries", error);
    res.status(500).json({ error: "Failed to migrate journal entries" });
  }
});

app.post('/api/journal/:id/export-drive', csrfProtection, isAuthenticated, rateLimit(10, 60000), async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { id } = req.params;

    const entry = await storage.getJournalEntry(userId, id);
    
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const result = await exportNoteToGoogleDrive(
      entry.title,
      entry.content,
      entry.tags || [],
      entry.createdAt
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      fileId: result.fileId,
      fileName: result.fileName,
      webViewLink: result.webViewLink,
    });
  } catch (error) {
    logger.error("Error exporting journal entry to Google Drive", error);
    res.status(500).json({ error: "Failed to export to Google Drive" });
  }
});

// Delete user account and all associated data
app.delete('/api/auth/delete-account', csrfProtection, isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Delete user data from database
    await storage.deleteUser(userId);
    
    // Log the user out and destroy their session
    req.logout((err) => {
      if (err) {
        logger.error("Error during logout after account deletion", err);
      }
      
      // Destroy the session
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          logger.error("Error destroying session after account deletion", sessionErr);
        }
        
        res.json({ success: true, message: "Account deleted successfully" });
      });
    });
  } catch (error) {
    logger.error("Error deleting account", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    res.status(500).json({ 
      error: "Failed to delete account. Please try again or contact support.",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

app.get('/health', async (req: Request, res: Response): Promise<void> => {
  // Health endpoint can be cached for a short period (10 seconds)
  res.setHeader('Cache-Control', 'public, max-age=10');
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'unknown'
  };

  // Check database connectivity using Neon serverless pool
  try {
    // Use pool.query() for Neon serverless (no need for connect/release)
    await pool.query('SELECT 1');
    health.database = 'connected';
  } catch (dbError) {
    health.database = 'error';
    health.databaseError = process.env.NODE_ENV === 'development' ? dbError.message : undefined;
    
    // Check for specific error types
    if (dbError.code === 'ECONNREFUSED' || dbError.code === 'ETIMEDOUT') {
      health.database = 'unavailable';
    }
  }

  // Return appropriate status code based on health
  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Global error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, { path: req.path, method: req.method });
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Handle specific error types
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'An error occurred',
      ...(isDevelopment && { stack: err.stack, details: err })
    });
  }
  
  // Handle database errors
  if (err.code && err.code.startsWith('23')) {
    // PostgreSQL constraint violations
    return res.status(400).json({
      error: 'Database constraint violation',
      ...(isDevelopment && { details: err.message })
    });
  }
  
  // Handle connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Database connection failed. Please try again later.'
    });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    ...(isDevelopment && { 
      message: err.message,
      stack: err.stack,
      details: err 
    })
  });
});

// Serve static files from the dist directory in production
// NOTE: In normal production deployment, Vite preview (port 5000) handles static file serving
// and proxies API requests to this Express server (port 3001). This static file serving
// is a fallback for direct access to port 3001, which shouldn't happen in production but
// provides resilience. In development, Vite dev server handles static files.
if (process.env.NODE_ENV === 'production') {
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Serve static assets with caching headers
  app.use(express.static(path.join(__dirname, 'dist'), {
    etag: true, // Enable ETag support for conditional requests
    lastModified: true, // Enable Last-Modified headers
    maxAge: '1y', // Cache static assets for 1 year (browser cache)
    immutable: true, // Mark as immutable (Vite adds content hashes to filenames)
    setHeaders: (res, path) => {
      // Additional headers for specific file types
      if (path.endsWith('.html')) {
        // HTML files should not be cached (SPA routing)
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (path.endsWith('.json')) {
        // JSON data files - cache for shorter period
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
      }
      // Other static assets (JS, CSS, images) get the default maxAge from above
    }
  }));
  
  // SPA catchall - serve index.html for all non-API routes
  // This ensures React Router works when accessing Express directly
  app.get('*', (req, res, next) => {
    // Skip API routes - let them fall through to 404 handler
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// 404 handler for undefined routes (must be after static file serving)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  logger.info(`Backend server running on http://${HOST}:${PORT}`);
  logger.info(`Accessible at http://localhost:${PORT} in development`);
  if (process.env.NODE_ENV === 'production') {
    logger.info('Serving production build from dist/');
  }
});
