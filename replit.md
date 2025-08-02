# GitHub Portfolio Dashboard

## Overview

This is a full-stack web application that creates a beautiful portfolio dashboard from GitHub profiles. The app allows users to authenticate with GitHub OAuth, view their repositories and statistics, pin favorite projects, analyze programming language usage with charts, and generate PDF resumes from their GitHub data.

The application is built as a React frontend with an Express backend, using PostgreSQL for data persistence and integrating with GitHub's GraphQL API for real-time data fetching.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript in client-side rendering mode
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Charts**: Recharts for data visualization (pie charts, bar charts)

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Authentication**: Replit Auth with OpenID Connect for user authentication
- **API Design**: RESTful API endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Data Storage
- **Database**: PostgreSQL with Neon serverless deployment
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Session Storage**: PostgreSQL table for user sessions (required for Replit Auth)
- **Data Models**: Users, pinned repositories, and GitHub user data caching

### Authentication and Authorization
- **Provider**: Replit Auth (OpenID Connect) for primary authentication
- **GitHub Integration**: OAuth flow to obtain GitHub access tokens for API access
- **Session Security**: HTTP-only cookies with secure flags and CSRF protection
- **Token Management**: GitHub access tokens stored securely and used for API calls

### External Dependencies
- **GitHub API**: GraphQL v4 API for fetching user profiles, repositories, and contribution data
- **PDF Generation**: Puppeteer for server-side PDF generation from HTML templates
- **Database**: Neon PostgreSQL serverless database
- **Deployment**: Designed for Replit hosting environment

The architecture follows a separation of concerns pattern with the frontend handling user interactions and data presentation, while the backend manages authentication, external API integrations, and data persistence. The application uses modern development practices including TypeScript for type safety, proper error handling, and responsive design patterns.