import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { setupAuth, isAuthenticated } from './server/replitAuth.js';
import { storage } from './server/storage.js';

if (!process.env.XAI_API_KEY) {
  console.error('ERROR: XAI_API_KEY environment variable is not set.');
  console.error('The backend server cannot function without an API key.');
  process.exit(1);
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
app.use(express.json());

// Setup authentication (must be done before routes)
await setupAuth(app);

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY
});

app.post('/api/poetry-example', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
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

app.get('/api/sancho-quote', async (req, res) => {
  try {
    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server' });
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

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Backend server running on http://${HOST}:${PORT}`);
  console.log(`Accessible at http://localhost:${PORT} in development`);
});
