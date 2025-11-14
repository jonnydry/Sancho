# Sancho - Poetry Guide

A React-based web application for exploring poetic forms, meters, and devices. Built with React, TypeScript, Vite, and powered by XAI's Grok for AI-generated poetry examples.

## Overview

Sancho is your faithful guide to poetry, featuring:
- Browse different poetic forms (sonnets, haikus, villanelles, etc.)
- Explore poetic meters (iambic pentameter, trochaic, etc.)  
- Learn about poetic devices (metaphor, alliteration, enjambment, etc.)
- Generate AI-powered examples using XAI's Grok model
- Dynamic Sancho Panza quotes from Don Quixote displayed on homepage
- Beautiful theme system with multiple color schemes (Dark, Paper, Slate)
- Responsive design with Tailwind CSS
- Custom Sancho logo featuring a donkey reading poetry

## Recent Changes

- **2025-11-14**: Implemented Replit Auth authentication system with PostgreSQL session storage
- **2025-11-14**: Added premium theme restrictions - only logged-in users can access Paper and Slate themes
- **2025-11-14**: Default theme set to 'dark' (black/white) for all users
- **2025-11-14**: Created users and sessions database schema with Drizzle ORM
- **2025-11-14**: Configured conditional session cookies (secure in production, not in development)
- **2025-11-14**: Added AI-powered Sancho Panza quote feature that displays authentic quotes from Don Quixote
- **2025-11-14**: Implemented secure backend architecture (Express server on port 3001) to protect API key
- **2025-11-14**: Updated site logo to custom Sancho image (40% larger for readability)
- **2025-11-14**: Configured Vite proxy to route API calls to backend server
- **2025-11-14**: Migrated from Google Gemini AI to XAI (Grok) for poetry example generation
- **2025-11-14**: Configured for Replit environment with proper CORS and host settings

## Project Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript (Port 5000)
- **Backend**: Express.js (Port 3001)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN)
- **AI**: XAI Grok API (grok-2-1212 model)
- **Package Manager**: npm

### Project Structure
```
├── components/          # React components
│   ├── icons/          # SVG icon components
│   ├── Header.tsx      # App header with theme switcher
│   ├── PoetryCard.tsx  # Card component for poetry items
│   ├── PoetryDetailModal.tsx  # Modal for detailed view
│   ├── SearchFilter.tsx  # Search and filter controls
│   ├── ExampleFinder.tsx  # AI example generation
│   └── ThemeSwitcher.tsx  # Theme toggle component
├── contexts/           # React contexts
│   └── ThemeContext.tsx  # Theme management
├── data/              # Static data
│   ├── poetryData.ts  # Poetry forms and meters
│   └── poeticDevicesData.ts  # Poetic devices
├── hooks/             # Custom React hooks
│   └── useTheme.ts   # Theme hook
├── services/          # API services
│   └── apiService.ts  # Backend API integration (handles poetry examples & Sancho quotes)
├── public/            # Static assets
│   └── sancho-logo.png  # Custom Sancho logo image
├── server.js          # Express backend server (port 3001)
├── App.tsx            # Main app component
├── index.tsx          # App entry point
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration with API proxy

```

### Key Features
1. **Authentication System**: Replit Auth integration supporting Google, GitHub, email/password, Apple, and X login
2. **Premium Theme Access**: Logged-in users unlock Paper and Slate themes; logged-out users use default Dark theme
3. **Sancho Quote Feature**: Displays AI-generated authentic quotes from Sancho Panza (Don Quixote) on page load
4. **Glassomorphic Sticky Header**: Semi-transparent header with backdrop blur, displays login status and login/logout buttons
5. **Theme System**: Supports light/dark mode with 3 color schemes (Dark - free, Paper - premium, Slate - premium)
6. **AI Poetry Examples**: Uses XAI's Grok to generate poetry examples on demand
7. **Search & Filter**: Filter by type (Form, Meter, Device) and search by name
8. **Responsive Design**: Mobile-friendly interface with smooth animations
9. **Secure Backend**: API key protected server-side architecture with PostgreSQL session storage

## Environment Variables

- `XAI_API_KEY`: Required for AI-powered poetry example generation (managed via Replit Secrets)
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `SESSION_SECRET`: Session encryption secret (auto-configured by Replit)
- `REPL_ID`: Replit project ID for OAuth (auto-configured by Replit)
- `ISSUER_URL`: OpenID Connect issuer URL (defaults to https://replit.com/oidc)

## Development

The app uses a dual-server architecture:
- **Frontend (Vite)**: Port 5000 with hot module replacement (HMR)
- **Backend (Express)**: Port 3001 for secure API calls to XAI

The workflow automatically starts both servers concurrently.

### Running Locally
```bash
npm install
npm run dev  # Starts both backend (3001) and frontend (5000)
```

### API Endpoints

**Authentication Routes:**
- `GET /api/login`: Initiate Replit Auth login flow (supports Google, GitHub, email/password, Apple, X)
- `GET /api/callback`: OAuth callback handler
- `GET /api/logout`: Log out and clear session
- `GET /api/auth/user`: Get current authenticated user (protected route)

**AI & Content Routes:**
- `POST /api/poetry-example`: Generate poetry examples (requires topic in request body)
- `GET /api/sancho-quote`: Fetch a Sancho Panza quote from Don Quixote
- `GET /health`: Health check endpoint

### Building for Production
```bash
npm run build
npm run preview
```

## User Preferences

None documented yet.

## Security & Authentication

✅ **Secure Architecture Implemented**: This app uses a secure backend proxy pattern with session-based authentication.

**Security Features:**
- ✅ Replit Auth OAuth integration with PostgreSQL session storage
- ✅ Session cookies marked `secure` in production, `httpOnly` always enabled
- ✅ Backend Express server handles all XAI API calls
- ✅ API key stored server-side only (never exposed to browser)
- ✅ CORS configured for development and production environments
- ✅ Frontend uses Vite proxy to route API requests to backend
- ✅ Server binds to 0.0.0.0 for deployment compatibility
- ✅ Protected routes use `isAuthenticated` middleware
- ✅ Theme enforcement prevents premium theme access for logged-out users

**Authentication Flow:**
1. User clicks "Log in" button in header
2. Redirects to `/api/login` which initiates Replit Auth OAuth flow
3. User authenticates with chosen provider (Google, GitHub, etc.)
4. OAuth callback to `/api/callback` creates session and stores user in database
5. Session persists in PostgreSQL with 7-day expiration
6. Frontend `useAuth` hook fetches user status from `/api/auth/user`
7. Premium themes (Paper, Slate) unlock for authenticated users

**Production Ready:**
- The current architecture is secure for production deployment
- API key is protected from client-side exposure
- Session cookies work correctly in both HTTP (dev) and HTTPS (prod)
- Database migrations handled by Drizzle ORM
- CORS settings should be updated with your production domain

## Notes

- The service file is named `apiService.ts` and handles all backend API calls to XAI
- Tailwind CSS is loaded via CDN (works but not optimal for production)
- For production deployment, consider installing Tailwind as a PostCSS plugin
- Custom Sancho logo displays prominently at 288px (w-72 h-72) for maximum visibility
- Tagline "A Poetic Reference Squire" appears below logo with elegant uppercase styling
- Quote feature includes smooth fade-in animation sequence (logo → tagline → quote)
- Quote feature fetches new Sancho wisdom on each page load via XAI API
- Intelligent quote caching: stores up to 15 unique quotes in localStorage for offline access
- Offline fallback: displays random cached quote if connection is lost or API fails
- Originally designed for AI Studio environment, migrated and enhanced for Replit
