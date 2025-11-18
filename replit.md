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
- **AI Integration**: XAI Grok API (`grok-2-1212` model) for poetry example generation.
- **Database**: PostgreSQL managed with Drizzle ORM for user and session data.
- **Error Handling**: React Error Boundary for graceful fallback UI.
- **Performance**: Optimized build (270 KB JS, 27.5 KB CSS), rate limiting on API endpoints, and client-side caching.

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