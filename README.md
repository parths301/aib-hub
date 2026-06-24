# AIB Hub

A creator hub and job board registration dashboard built with React, TypeScript, and Supabase.

## Overview

AIB Hub is a modern dashboard prototype for creators and freelancers to register with a job board platform. The application features a premium gold-gradient aesthetic and is built with contemporary web technologies.

## Features

- **Creator Registration**: Easy onboarding flow for new creators and freelancers
- **Job Board Integration**: Browse and register for available opportunities
- **Premium UI Design**: Distinctive gold-gradient styling with smooth animations
- **Responsive Dashboard**: Fully responsive layout built with Tailwind CSS
- **Real-time Database**: Powered by Supabase for instant data synchronization

## Tech Stack

- **Frontend**: React 19.2 + TypeScript
- **Styling**: Tailwind CSS with custom gold-gradient theme
- **Routing**: React Router v7
- **Backend**: Supabase (PostgreSQL database + authentication)
- **Build Tool**: Vite
- **Runtime**: Node.js (ES modules)

## Setup & Usage

### Prerequisites
- Node.js 16+ 
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/parths301/aib-hub.git
   cd aib-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env.local`):
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable UI components
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Deployment

Deploy to Vercel, Netlify, or GitHub Pages:

```bash
npm run build
```

Then deploy the `dist/` folder to your hosting provider.

## License

Copyright © 2025 Parth Sharma. All rights reserved.
