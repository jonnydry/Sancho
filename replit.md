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
│   └── geminiService.ts  # Backend API integration (handles poetry examples & Sancho quotes)
├── public/            # Static assets
│   └── sancho-logo.png  # Custom Sancho logo image
├── server.js          # Express backend server (port 3001)
├── App.tsx            # Main app component
├── index.tsx          # App entry point
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration with API proxy

```

### Key Features
1. **Sancho Quote Feature**: Displays AI-generated authentic quotes from Sancho Panza (Don Quixote) on page load
2. **Theme System**: Supports light/dark mode with 3 color schemes (Dark, Paper, Slate)
3. **AI Poetry Examples**: Uses XAI's Grok to generate poetry examples on demand
4. **Search & Filter**: Filter by type (Form, Meter, Device) and search by name
5. **Responsive Design**: Mobile-friendly interface with smooth animations
6. **Secure Backend**: API key protected server-side architecture

## Environment Variables

- `XAI_API_KEY`: Required for AI-powered poetry example generation (managed via Replit Secrets)

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

## Security

✅ **Secure Architecture Implemented**: This app uses a secure backend proxy pattern to protect the XAI API key.

**Security Features:**
- ✅ Backend Express server handles all XAI API calls
- ✅ API key stored server-side only (never exposed to browser)
- ✅ CORS configured for development and production environments
- ✅ Frontend uses Vite proxy to route API requests to backend
- ✅ Server binds to 0.0.0.0 for deployment compatibility

**Production Ready:**
- The current architecture is secure for production deployment
- API key is protected from client-side exposure
- CORS settings should be updated with your production domain
- Ensure XAI_API_KEY is set in deployment environment

## Notes

- The service file is named `geminiService.ts` (legacy name) but handles all backend API calls
- Tailwind CSS is loaded via CDN (works but not optimal for production)
- For production deployment, consider installing Tailwind as a PostCSS plugin
- Custom Sancho logo displays prominently at 288px (w-72 h-72) for maximum visibility
- Quote feature includes smooth fade-in animation with 0.3s delay after logo appears
- Quote feature fetches new Sancho wisdom on each page load
- Originally designed for AI Studio environment, migrated and enhanced for Replit
