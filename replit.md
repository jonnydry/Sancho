# Sancho - Poetry Guide

## Overview

Sancho is a React-based web application that serves as a comprehensive guide to poetry. It allows users to explore various poetic forms, meters, and devices, and provides AI-generated poetry examples using XAI's Grok model. The project aims to be a valuable resource for poetry enthusiasts and learners, offering a rich educational experience with a focus on user-friendly design and modern web technologies.

**Key Capabilities:**
- **Extensive Poetry Database**: Browse 37 poetic forms, 22 poetic meters, and 31 poetic devices.
- **AI-Powered Examples**: Generate poetry examples using XAI's Grok model.
- **Dynamic Content**: Features dynamic Sancho Panza quotes from Don Quixote.
- **Theming System**: Multiple color schemes (Dark, Paper, Slate) with premium options.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Authentication**: Replit Auth integration for user management and premium features.
- **SEO Optimized**: Comprehensive meta tags and structured data for discoverability.

## User Preferences

I prefer simple language and detailed explanations. I want iterative development with clear communication at each step. Ask before making major changes. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture

The project utilizes a dual-server architecture with a React frontend (Vite, Port 5000) and an Express.js backend (Port 3001).

**UI/UX Decisions:**
- **Color Schemes**: Dark (default), Paper (premium), Slate (premium) themes.
- **Responsive Design**: Implemented with Tailwind CSS v4, optimized for mobile-first.
- **Custom Branding**: Features a custom Sancho logo and tagline "A Poetic Reference Squire."
- **User-Friendly Interface**: Includes search and filter functionalities, modal for detailed views, and clear navigation.
- **SEO**: Comprehensive meta tags (title, description, keywords, Open Graph, Twitter cards, JSON-LD structured data) for improved search engine visibility.

**Technical Implementations:**
- **Frontend**: React 19, TypeScript, Vite 6, React Router DOM v6.
- **Backend**: Express.js for API handling and secure communication with XAI.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin for optimized builds.
- **Authentication**: Replit Auth (OpenID Connect) integrated with PostgreSQL session storage.
- **AI Integration**: XAI Grok API with multi-model strategy:
  - `grok-3-mini` for Sancho quotes (optimized for speed, ~40-50% faster)
  - `grok-4` for poetry examples (highest quality educational content)
  - `grok-4-fast` for learn more context (balanced speed and quality)
- **Database**: PostgreSQL managed with Drizzle ORM for user and session data.
- **Error Handling**: React Error Boundary for graceful fallback UI.
- **Performance**: Optimized build (270 KB JS, 27.5 KB CSS), rate limiting on API endpoints, 3-minute client-side quote caching, and aggressive model selection.

**System Design Choices:**
- **Modular Structure**: Organized into `components`, `contexts`, `data`, `hooks`, `pages`, `services`, and `server` directories.
- **Secure Backend Proxy**: Frontend communicates with the backend, which then securely calls the XAI API, protecting the API key.
- **Rate Limiting**: Implemented for all AI and quote API endpoints to manage resource usage.
- **Multi-Page Navigation**: Utilizes React Router for client-side routing, including About, Privacy Policy, Terms of Service, and 404 pages.

## External Dependencies

- **XAI Grok API**: Used for AI-powered poetry example generation and dynamic Sancho Panza quotes.
- **PostgreSQL**: Database for storing user information and session data.
- **Replit Auth**: Authentication service for user login and management, supporting various OAuth providers (Google, GitHub, email/password, Apple, X).
- **Tailwind CSS v4**: Utility-first CSS framework for styling.
- **React Router DOM v6**: For client-side routing and navigation.

## Deployment Status

**Status**: ✅ Published on Replit (Autoscale)  
**Last Deployed**: November 16, 2025

### Deployment Configuration
- **Build Command**: `npm run build` (Vite production bundle)
- **Run Command**: `npm run preview:prod` (Backend + Frontend on port 5000)
- **Deployment Type**: Autoscale (scales 0→N instances based on traffic)
- **Port Configuration**: Port 5000 (frontend) exposed to port 80 (public)

### Recent Updates

#### 2025-11-28 - Interactive Element Polish & Mobile Typography
- **Tag Button Hover Enhancements**: Added subtle scale-up animation (105%), soft shadow, and improved text/border visibility on hover across all tag buttons (card view, modal tags, and "See Also" section)
- **Mobile Font Size Optimization**: Reduced base font size from 18px to 15px on mobile devices (≤640px breakpoint) for better readability and proportional spacing
- **Consistent Button Behavior**: Applied same interactive feedback across tag buttons and "See Also" navigation buttons for cohesive UX

#### 2025-11-26 - UI Enhancements and Theme Fixes
- **Typography Scaling**: Increased base font size to 18px, card titles to 2xl for better readability
- **Card Element Proportions**: Harmonized all card elements (description: text-base, tags: text-xs, snippet: text-sm, type badge: text-xs)
- **Notebook Icon Sizing**: Enlarged notebook icons to lg size (w-6 h-6) for consistent visibility across cards and header
- **Devices Category Icon**: Created custom magnifying glass icon representing literary devices discovery
- **Paper Theme Accent Fix**: Changed accent color from green to rust/sepia (159 89 45) for cohesive manuscript aesthetic
- **Theme Persistence Fix**: Fixed race condition where premium themes were being reset before auth check completed
- **Sancho Quote Improvements**: English-only quotes with Edith Grossman translation preference, improved variety via random seeds

#### 2025-11-22 - Custom Literary-Themed Icon Set
- **Complete Icon Redesign**: Created 13 custom SVG icons with ornate, literary aesthetic that aligns with Sancho's classic poetry theme
- **AboutPage Icons**: PoeticFormsIcon (scroll with lines), PoeticMetersIcon (musical staff), LiteraryDevicesIcon (quill with ink), AiExamplesIcon (magical quill), ClassicSnippetsIcon (open book with bookmark), PremiumThemesIcon (artist's palette)
- **TermsPage Icons**: CheckIcon (ornate checkmark with circle), ProhibitedIcon (octagonal prohibition), ScrollIcon (classic parchment scroll)
- **PrivacyPage Icons**: LockIcon (vintage padlock with keyhole), CookieIcon (ornate cookie jar), KeyIcon (skeleton key), ShieldIcon (heraldic shield)
- **Design Philosophy**: Replaced generic utility icons with custom designs featuring ornate details, literary motifs, and cohesive visual language
- **Technical Quality**: All icons use consistent 24x24 viewBox, proper React TypeScript exports, currentColor for theme compatibility, and balanced stroke weights
- **Preserved**: BookPenIcon (Notebook feature) retained as requested

#### 2025-11-21 - Mobile Formatting Enhancements
- **Header Optimization**: Reduced spacing gaps on mobile (gap-4 → gap-8 on larger screens) for better header layout
- **Search Filter**: Adjusted tab gaps and font sizes for optimal mobile readability (text-xs → text-sm responsive scaling)
- **About Page**: Improved mobile padding (p-5 → p-8 responsive), scaled logo and titles appropriately for small screens
- **Sancho Quote**: Optimized horizontal padding for mobile devices (px-4 → px-8 responsive)
- **Modal**: Enhanced padding hierarchy (p-5 sm:p-6 md:p-8) for better content display on all screen sizes
- **Layout Stability**: Removed potential scroll jitter from filter tabs, maintaining clean bottom borders

#### 2025-11-20 - AI Model Optimization
- **Multi-Model Strategy**: Implemented different Grok models for different use cases to optimize both speed and quality
- **Sancho Quotes**: Switched to `grok-3-mini` for 40-50% faster quote generation on page load
- **Poetry Examples**: Upgraded to `grok-4` for highest quality educational content with richer explanations
- **Learn More Context**: Kept `grok-4-fast` for balanced speed and paragraph quality
- **Extended Caching**: Increased Sancho quote cache from 1 minute to 3 minutes for faster repeat visits
- **Performance Impact**: Significantly faster initial page loads while maintaining or improving content quality

#### 2025-11-18 - Pin Button Visual Feedback
- **Red Heart Fill Animation**: When users pin an item, the heart in the book icon fills with the accent color (red) using a smooth 300ms transition
- **Button Press Animation**: Added tactile feedback with a scale-down animation (90%) for 200ms when clicking the pin button
- **Enhanced Icon**: BookPenIcon now supports a `heartFilled` prop to toggle the heart fill state, maintaining backward compatibility
- **Improved User Experience**: Visual feedback makes pinning actions feel more responsive and satisfying

#### 2025-11-18 - Notebook Feature Error Handling Improvements
- **Better Error Messages**: Authentication errors now show clear, user-friendly messages (e.g., "Your session has expired. Please log in again" instead of "Unauthorized")
- **Automatic Re-authentication**: When session expires or authentication fails, users are automatically redirected to login page after seeing error notification
- **Enhanced Backend Errors**: Backend middleware now returns structured error responses with error codes (NOT_AUTHENTICATED, SESSION_EXPIRED, TOKEN_REFRESH_FAILED)
- **Improved UX**: Pin/unpin errors are now categorized and handled appropriately with specific error messages for each scenario
- **Icon Update**: Changed notebook icon from pen to book-with-pen (BookPenIcon) for better visual clarity

#### 2025-11-16 - Initial Deployment
- **Deployment Fix**: Configured Vite preview server to use port 5000 instead of default 4173
- **Production Build**: Added `preview:prod` script to run both Express backend and Vite preview
- **Learn More Feature**: Historical & Cultural Context API integrated with XAI Grok (`/api/poetry-learn-more`)
- **Mobile Optimization**: Responsive design across all components (cards, modal, header, filters)
- **Theme System**: Fixed Tailwind v4 compatibility with arbitrary value syntax for CSS variables

### Development vs Production
- **Development**: Runs on `https://<id>-00-<hash>.worf.replit.dev` with dev database
- **Production**: Runs on `https://<app-name>.replit.app` with separate production database
- **Separate Secrets**: Dev and production use different environment variables and database instances