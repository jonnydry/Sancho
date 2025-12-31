# SanchoPoetry.ref - Poetry Guide

## Overview

SanchoPoetry.ref is a React-based web application that serves as a comprehensive guide to poetry. It allows users to explore various poetic forms, meters, and devices, and provides AI-powered historical context using XAI's Grok model. The project aims to be a valuable resource for poetry enthusiasts and learners, offering a rich educational experience with a focus on user-friendly design and modern web technologies. Key capabilities include an extensive poetry database, AI-powered historical context, a dynamic theming system, responsive design, Replit Auth integration, and SEO optimization.

## User Preferences

I prefer simple language and detailed explanations. I want iterative development with clear communication at each step. Ask before making major changes. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture

The project utilizes a dual-server architecture with a React frontend (Vite) and an Express.js backend.

**UI/UX Decisions:**
- **Color Schemes**: Dark (default), Paper (premium), Slate (premium) themes.
- **Responsive Design**: Implemented with Tailwind CSS v4, optimized for mobile-first.
- **Custom Branding**: Features a custom Sancho logo and tagline "A Poetic Reference Squire."
- **User-Friendly Interface**: Includes search and filter functionalities, modal for detailed views, and clear navigation.
- **SEO**: Comprehensive meta tags (title, description, keywords, Open Graph, Twitter cards, JSON-LD structured data) for improved search engine visibility.
- **Custom Icons**: Custom SVG icons with an ornate, literary aesthetic.

**Technical Implementations:**
- **Frontend**: React 19, TypeScript, Vite 6, React Router DOM v6.
- **Backend**: Express.js for API handling and secure communication with XAI.
- **Styling**: Tailwind CSS v4.
- **Authentication**: Replit Auth (OpenID Connect) integrated with PostgreSQL session storage.
- **AI Integration**: XAI Grok API for historical context generation (learn more) and Sancho Panza quotes. Note: AI poetry example generation was removed.
- **Database**: PostgreSQL managed with Drizzle ORM for user and session data, including journal entries.
- **Performance**: Optimized build, rate limiting on API endpoints, client-side quote caching, and aggressive model selection.
- **Error Handling**: React Error Boundary for graceful fallback UI and improved error messages for authentication.
- **Notebook Feature**: Allows users to save journal entries, synchronized to the server with offline fallback. Shows a warning banner when not logged in, with "Local Only" status indicator and detailed console logging for debugging.
- **Bottom Panel**: IDE-style collapsible panel in journal view that appears when a poetry item is selected. Contains tabbed sections for Historical Context (AI-powered), AI Example generation, and Links (tags, see also, Grokipedia). Tags are clickable and open the Reference pane with search pre-filled. Panel is resizable (150-500px height range).

**System Design Choices:**
- **Modular Structure**: Organized into logical directories (components, contexts, data, hooks, pages, services, server).
- **Secure Backend Proxy**: Frontend communicates with the backend, which securely calls the XAI API, protecting the API key.
- **Rate Limiting**: Implemented for all AI and quote API endpoints.
- **Multi-Page Navigation**: Utilizes React Router for client-side routing.
- **Account Deletion**: Feature to delete user accounts and associated data.

## External Dependencies

- **XAI Grok API**: Used for AI-powered historical context and dynamic Sancho Panza quotes.
- **PostgreSQL**: Database for storing user information, session data, and journal entries.
- **Replit Auth**: Authentication service for user login and management.
- **Tailwind CSS v4**: Utility-first CSS framework for styling.
- **React Router DOM v6**: For client-side routing and navigation.