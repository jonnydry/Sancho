import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { setupAuth, isAuthenticated } from './server/replitAuth.js';
import { storage } from './server/storage.js';

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitStore = new Map();

function rateLimit(maxRequests, windowMs) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitStore.has(key)) {
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

    // Periodic cleanup: remove entries with no valid requests
    if (validRequests.length === 0) {
      rateLimitStore.delete(key);
    }

    next();
  };
}

// Periodic cleanup of rate limit store to prevent memory leaks
setInterval(() => {
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
}, 30 * 60 * 1000); // Run cleanup every 30 minutes

// Check for XAI API key but don't exit - allow graceful degradation for local dev
if (!process.env.XAI_API_KEY) {
  console.warn('WARNING: XAI_API_KEY environment variable is not set.');
  console.warn('AI features will be disabled. Set XAI_API_KEY to enable poetry examples and quotes.');
}

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Add payload size limit

// Input validation middleware
function validateInput(req, res, next) {
  // Sanitize string inputs
  const sanitizeString = (str, maxLength = 1000) => {
    if (typeof str !== 'string') return '';
    return str.trim().substring(0, maxLength).replace(/[<>]/g, '');
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
            return res.status(400).json({ error: 'Invalid input detected' });
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkForSuspiciousContent(obj[key]);
      }
    }
  };

  if (req.body) {
    checkForSuspiciousContent(req.body);
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

app.post('/api/poetry-example', rateLimit(10, 60000), async (req, res) => { // 10 requests per minute
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(503).json({
        error: 'AI features are currently disabled. Please configure XAI_API_KEY to enable poetry examples.'
      });
    }

    const prompt = `Please provide a famous, concise example of a ${topic} in poetry. Include the author, the title, and a brief explanation of how it fits the conventions. Respond with JSON in this format: { "example": "string", "author": "string", "title": "string", "explanation": "string" }`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a poetry expert. Provide famous poetic examples with detailed explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const jsonText = response.choices[0].message.content || "{}";
    const parsedJson = JSON.parse(jsonText);
    
    res.json(parsedJson);
  } catch (error) {
    console.error("Error fetching poetry example from XAI:", error);
    res.status(500).json({ 
      error: "Failed to generate example. The model may be unavailable or the request could not be fulfilled.",
      details: error.message 
    });
  }
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

    // Add variety by requesting a different quote each time
    const varietyHint = `Please provide a DIFFERENT quote than you may have given recently. `;
    const prompt = `${varietyHint}Please provide a single authentic quote from Sancho Panza from the novel "Don Quixote" by Miguel de Cervantes. The quote should be wise, humorous, or insightful - something that reflects Sancho's character.

Key guidelines:
- Quote must be genuinely from Don Quixote (cite the specific part/chapter if possible)
- Should showcase Sancho's personality: practical, humorous, loyal, or philosophical
- Keep quote concise but authentic to Cervantes' writing style
- Include accurate context when possible (chapter reference, situation)
- Choose a quote that differs from common or frequently cited ones

Respond with JSON in this format: { "quote": "the actual quote text", "context": "brief context about when/why Sancho said this (e.g., Part I, Chapter 5)" }`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a literature expert specializing in Miguel de Cervantes' Don Quixote. Only provide quotes that are actually from the novel, paraphrasing into proper English when needed while preserving the original meaning. Always include accurate chapter/part references when available."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Slightly higher temperature for more variety
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
      console.error('Failed to parse AI response as JSON:', jsonText);
      throw new Error('Invalid response format from AI service');
    }

    // Validate the response structure
    if (!parsedJson.quote || typeof parsedJson.quote !== 'string') {
      throw new Error('AI service did not return a valid quote');
    }

    // Trim whitespace and normalize quote
    parsedJson.quote = parsedJson.quote.trim();
    if (parsedJson.context) {
      parsedJson.context = parsedJson.context.trim();
    }

    res.json(parsedJson);
  } catch (error) {
    console.error("Error fetching Sancho quote from XAI:", error);

    // Specific rate limiting error (from express-rate-limit middleware)
    if (error.message?.includes('Too many requests') || res.statusCode === 429) {
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
      model: "grok-2-1212",
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
    console.error("Error fetching learn more context from XAI:", error);
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
    console.error("Error fetching user:", error);
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
    console.error("Error fetching pinned items:", error);
    res.status(500).json({ error: "Failed to fetch pinned items" });
  }
});

app.post('/api/pinned-items', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { itemData } = req.body;

    if (!itemData || !itemData.name) {
      return res.status(400).json({ error: "Invalid item data" });
    }

    const pinned = await storage.pinItem(userId, itemData);
    res.json({ item: pinned.itemData });
  } catch (error) {
    console.error("Error pinning item:", error);
    res.status(500).json({ error: "Failed to pin item" });
  }
});

app.delete('/api/pinned-items/:itemName', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { itemName } = req.params;

    if (!itemName) {
      return res.status(400).json({ error: "Item name is required" });
    }

    await storage.unpinItem(userId, decodeURIComponent(itemName));
    res.json({ success: true });
  } catch (error) {
    console.error("Error unpinning item:", error);
    res.status(500).json({ error: "Failed to unpin item" });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // SPA catchall - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Backend server running on http://${HOST}:${PORT}`);
  console.log(`Accessible at http://localhost:${PORT} in development`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving production build from dist/');
  }
});
