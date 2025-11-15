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
        error: 'AI features are currently disabled. Please configure XAI_API_KEY to enable Sancho quotes.'
      });
    }

    const prompt = `Please provide a single authentic quote from Sancho Panza from the novel "Don Quixote" by Miguel de Cervantes. The quote should be wise, humorous, or insightful - something that reflects Sancho's character. Respond with JSON in this format: { "quote": "the actual quote text", "context": "brief context about when/why Sancho said this" }`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a literature expert specializing in Don Quixote. Provide authentic quotes from Sancho Panza that capture his wisdom and personality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const jsonText = response.choices[0].message.content || "{}";
    const parsedJson = JSON.parse(jsonText);
    
    res.json(parsedJson);
  } catch (error) {
    console.error("Error fetching Sancho quote from XAI:", error);
    res.status(500).json({ 
      error: "Failed to fetch quote",
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
