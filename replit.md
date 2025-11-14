# Sancho - Poetry Guide

A React-based web application for exploring poetic forms, meters, and devices. Built with React, TypeScript, Vite, and powered by XAI's Grok for AI-generated poetry examples.

## Overview

Sancho is your faithful guide to poetry, featuring:
- Browse different poetic forms (sonnets, haikus, villanelles, etc.)
- Explore poetic meters (iambic pentameter, trochaic, etc.)  
- Learn about poetic devices (metaphor, alliteration, enjambment, etc.)
- Generate AI-powered examples using XAI's Grok model
- Beautiful theme system with multiple color schemes (Dark, Paper, Slate)
- Responsive design with Tailwind CSS

## Recent Changes

- **2025-11-14**: Migrated from Google Gemini AI to XAI (Grok) for poetry example generation
- **2025-11-14**: Configured for Replit environment with port 5000
- **2025-11-14**: Removed conflicting import maps to work with Vite bundler
- **2025-11-14**: Set up XAI integration with API key management

## Project Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
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
│   └── geminiService.ts  # XAI API integration (legacy name)
├── App.tsx            # Main app component
├── index.tsx          # App entry point
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration

```

### Key Features
1. **Theme System**: Supports light/dark mode with 3 color schemes (Dark, Paper, Slate)
2. **AI Integration**: Uses XAI's Grok to generate poetry examples on demand
3. **Search & Filter**: Filter by type (Form, Meter, Device) and search by name
4. **Responsive Design**: Mobile-friendly interface with smooth animations

## Environment Variables

- `XAI_API_KEY`: Required for AI-powered poetry example generation (managed via Replit Secrets)

## Development

The app runs on port 5000 and uses Vite's development server with hot module replacement (HMR).

### Running Locally
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

## User Preferences

None documented yet.

## Notes

- The service file is still named `geminiService.ts` but now uses XAI's API  
- Tailwind CSS is loaded via CDN (not recommended for production)
- For production deployment, consider installing Tailwind as a PostCSS plugin
