# Sancho - Poetry Guide

A React-based web application for exploring poetic forms, meters, and devices. Built with React, TypeScript, Vite, and powered by XAI's Grok for AI-generated poetry examples.

## Overview

Sancho is your faithful guide to poetry, featuring:
- Browse **37 poetic forms** (sonnets, haikus, villanelles, epics, acrostics, etc.)
- Explore **22 poetic meters** (iambic pentameter, trochaic, dactylic, metrical feet, etc.)
- Learn about **31 poetic devices** (metaphor, alliteration, enjambment, caesura, volta, etc.)
- Generate AI-powered examples using XAI's Grok model
- Dynamic Sancho Panza quotes from Don Quixote displayed on homepage
- Beautiful theme system with multiple color schemes (Dark, Paper, Slate)
- Responsive design with Tailwind CSS
- Custom Sancho logo featuring a donkey reading poetry

## Recent Changes

### Production-Ready Improvements (2025-11-15)
- **✅ Tailwind CSS v4 Vite Plugin**: Migrated from CDN to proper Tailwind v4 with @tailwindcss/vite (27.5 KB CSS, 5.7 KB gzipped)
- **✅ Tailwind v4 Theme System**: Configured @variant dark for class-based dark mode and @theme for custom color utilities
- **✅ Dynamic Theme System Fixed**: Renamed runtime CSS variables to --app-* to avoid circular dependencies, properly mapped to Tailwind utilities
- **✅ Theme Toggle Buttons Fixed**: Added missing toggleMode to useMemo dependencies in ThemeContext to fix stale function references
- **✅ Comprehensive SEO**: Added meta tags (title, description, keywords, Open Graph, Twitter cards, JSON-LD structured data)
- **✅ Custom Favicon**: Used sancho-logo.png as favicon for brand consistency
- **✅ Rate Limiting**: API endpoints protected (10 req/min for poetry examples, 5 req/min for quotes)
- **✅ Error Boundary**: React Error Boundary with graceful fallback UI for production stability
- **✅ React Router**: Multi-page navigation (/, /about, /privacy, /terms, 404) with SPA client-side routing
- **✅ Legal Pages**: Privacy Policy, Terms of Service, About page for compliance
- **✅ Production Build Tested**: Build process verified and optimized (270 KB JS bundle, 83.8 KB gzipped)
- **✅ CORS Production Config**: Environment-aware CORS with FRONTEND_URL support
- **✅ User-Friendly Error Messages**: Improved API error handling with fallbacks
- **✅ Keyboard Shortcuts**: Modal closes with Escape key
- **✅ Modal Readability**: Fully opaque modal background using theme colors with 80% backdrop opacity

### Earlier Changes
- **2025-11-15**: Expanded poetry database to comprehensive coverage: added 13 new forms (Acrostic, Epigram, Epic, Couplet, Quatrain, Tercet, Senryu, Concrete Poetry, Ballade, Rubaiyat, Prose Poetry, Sapphic Stanza, Ekphrastic Poetry), 7 new meters (Iamb, Trochee, Dactyl, Anapest, Catalexis, Acephalous, Feminine Ending), and 18 new devices (Caesura, Anaphora, Imagery, Symbolism, Allusion, Metonymy, Paradox, Refrain, Internal Rhyme, Slant Rhyme, Cacophony, Euphony, Juxtaposition, Volta, Chiasmus, Epistrophe, Repetition, Pun) for a total of 90 poetry elements
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
- **Build Tool**: Vite 6 with Tailwind v4 Vite plugin
- **Styling**: Tailwind CSS v4 (production-optimized, 5.7 KB gzipped)
- **Routing**: React Router DOM v6
- **AI**: XAI Grok API (grok-2-1212 model)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Package Manager**: npm

### Project Structure
```
├── components/          # React components
│   ├── icons/          # SVG icon components
│   ├── ErrorBoundary.tsx  # Error boundary for graceful failures
│   ├── Header.tsx      # App header with navigation and auth
│   ├── PoetryCard.tsx  # Card component for poetry items
│   ├── PoetryDetailModal.tsx  # Modal for detailed view
│   ├── SearchFilter.tsx  # Search and filter controls
│   ├── ExampleFinder.tsx  # AI example generation
│   ├── SanchoQuote.tsx # Dynamic quote component
│   └── ThemeSwitcher.tsx  # Theme toggle component
├── contexts/           # React contexts
│   └── ThemeContext.tsx  # Theme management
├── data/              # Static data
│   ├── poetryData.ts  # Poetry forms and meters
│   └── poeticDevicesData.ts  # Poetic devices
├── hooks/             # Custom React hooks
│   ├── useTheme.ts   # Theme hook
│   └── useAuth.js    # Authentication hook
├── pages/             # Page components
│   ├── HomePage.tsx  # Main poetry browser
│   ├── AboutPage.tsx # About Sancho
│   ├── PrivacyPage.tsx # Privacy policy
│   ├── TermsPage.tsx # Terms of service
│   └── NotFoundPage.tsx # 404 page
├── services/          # API services
│   └── apiService.ts  # Backend API integration
├── server/            # Backend modules
│   ├── replitAuth.js # Replit Auth setup
│   └── storage.js    # Database operations
├── shared/            # Shared code
│   └── schema.js     # Database schema (Drizzle)
├── public/            # Static assets
│   └── sancho-logo.png  # Custom Sancho logo & favicon
├── server.js          # Express backend server (port 3001)
├── App.tsx            # Router and layout
├── index.tsx          # App entry point with ErrorBoundary
├── styles.css         # Tailwind + custom CSS variables
├── types.ts           # TypeScript type definitions
├── vite.config.ts     # Vite + Tailwind v4 plugin config
└── REPLIT_GUIDELINES.md # Developer guidelines for Replit constraints

```

### Key Features
1. **Authentication System**: Replit Auth integration supporting Google, GitHub, email/password, Apple, and X login
2. **Premium Theme Access**: Logged-in users unlock Paper and Slate themes; logged-out users use default Dark theme
3. **Multi-Page Navigation**: React Router with About, Privacy Policy, Terms of Service, and 404 pages
4. **SEO Optimized**: Comprehensive meta tags, Open Graph cards, Twitter cards, and JSON-LD structured data
5. **Production-Ready**: Tailwind CSS v4 Vite plugin, error boundaries, rate limiting, optimized build
6. **Sancho Quote Feature**: AI-generated authentic quotes from Don Quixote with offline caching
7. **Theme System**: Light/dark mode with 3 color schemes (Dark - free, Paper - premium, Slate - premium)
8. **AI Poetry Examples**: XAI Grok generates examples on demand with rate limiting (10 req/min)
9. **Search & Filter**: Filter by type (Form, Meter, Device) and search by name
10. **Responsive Design**: Mobile-friendly interface with smooth animations
11. **Secure Backend**: API key protected server-side architecture with PostgreSQL session storage
12. **Error Handling**: React Error Boundary with user-friendly fallback UI

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
- `POST /api/poetry-example`: Generate poetry examples (requires topic in request body) - Rate limited: 10 req/min
- `GET /api/sancho-quote`: Fetch a Sancho Panza quote from Don Quixote - Rate limited: 5 req/min
- `GET /health`: Health check endpoint

**Rate Limiting:**
All API endpoints implement in-memory rate limiting to prevent abuse and control XAI API costs.

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

## Production Deployment

### Pre-Deployment Checklist
✅ **Completed:**
- Tailwind CSS v4 production build configured
- SEO meta tags and structured data added
- Rate limiting on all AI endpoints
- Error boundaries implemented
- Legal pages (Privacy, Terms, About) created
- Production build tested (270 KB bundle, 83.8 KB gzipped)
- CORS configured for production (use FRONTEND_URL env var)
- Custom favicon from sancho-logo.png
- React Router for multi-page navigation

### Deployment Steps (Replit)
1. Click "Deploy" button in Replit
2. Configure deployment:
   - **Type**: Autoscale (stateless web app)
   - **Build Command**: `npm run build`
   - **Run Command**: `node server.js` (serves both frontend & backend)
3. Set production environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-domain.com` (for CORS)
4. Publish and monitor in deployment dashboard

### Performance
- **Bundle Size**: 270 KB JavaScript (83.8 KB gzipped)
- **CSS**: 27.5 KB (5.7 KB gzipped) - optimized Tailwind v4
- **API Rate Limits**: 10 req/min (poetry), 5 req/min (quotes)
- **Caching**: Quote caching in localStorage for offline access

## Notes

- The service file is named `apiService.ts` and handles all backend API calls to XAI
- ✅ **Tailwind CSS v4 Vite plugin** is production-optimized (was previously CDN)
- Custom Sancho logo displays prominently at 288px (w-72 h-72) and serves as favicon
- Tagline "A Poetic Reference Squire" appears below logo with elegant uppercase styling
- Quote feature includes smooth fade-in animation sequence (logo → tagline → quote)
- Quote feature fetches new Sancho wisdom on each page load via XAI API
- Intelligent quote caching: stores up to 15 unique quotes in localStorage for offline access
- Offline fallback: displays random cached quote if connection is lost or API fails
- React Error Boundary catches runtime errors and displays user-friendly fallback
- All legal pages (Privacy, Terms, About) are accessible from footer
- Originally designed for AI Studio environment, migrated and enhanced for Replit
- See **REPLIT_GUIDELINES.md** for critical development constraints and best practices
