# AniParadise Project Structure

## Overview
AniParadise is a full-stack anime tracking web application built with React, Node.js, and PostgreSQL.

## Frontend Structure ✅

```
frontend/
├── src/
│   ├── animations/
│   │   └── variants.js              # Centralized Framer Motion variants
│   ├── components/
│   │   ├── AnimatedCard.jsx         # Reusable card with hover animations
│   │   ├── AnimatedCard.module.css
│   │   ├── AnimatedButton.jsx         # Button with tap/hover feedback
│   │   ├── AnimatedButton.module.css
│   │   ├── AnimatedList.jsx           # Staggered list animations
│   │   └── PageTransition.jsx         # Page transition wrapper
│   ├── pages/
│   │   ├── Home.jsx                   # Home page
│   │   ├── Home.module.css
│   │   ├── AnimeDetail.jsx            # Anime detail page
│   │   ├── AnimeDetail.module.css
│   │   ├── Login.jsx                  # Login page
│   │   ├── Login.module.css
│   │   └── Register.jsx               # Registration page
│   ├── App.jsx                        # Main app with routing
│   ├── App.css                        # Global styles
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Base styles
├── package.json
└── vite.config.js
```

## Animation System

### Components Created:
1. **PageTransition** - Wraps pages for smooth route transitions
2. **AnimatedCard** - Cards with hover scale + shadow effects
3. **AnimatedButton** - Buttons with hover lift + tap feedback
4. **AnimatedList** - Staggered fade-in for lists

### Animation Variants:
- `pageTransition` - Fade + slide (0.3s easeOut)
- `cardHover` - Scale 1.02 + shadow increase (0.2s)
- `listItem` - Staggered fade-in with upward motion
- `buttonTap` - Hover lift + tap scale down

## Next Steps

### Backend (To Be Built)
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── anime.js          # Jikan API proxy routes
│   │   └── tracker.js        # Tracker CRUD routes
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── config/
│   │   └── database.js       # PostgreSQL connection
│   ├── utils/
│   │   └── jwt.js            # JWT helpers
│   └── server.js             # Express app entry
├── package.json
└── .env.example
```

### Database Schema (To Be Created)
```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- tracker table
CREATE TABLE tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);
```

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Anime (Jikan Proxy)
- `GET /api/anime` - Search/list anime
- `GET /api/anime/:id` - Get anime details

### Tracker
- `GET /api/tracker` - Get user's tracker list
- `POST /api/tracker` - Add anime to tracker
- `PUT /api/tracker/:id` - Update tracker status
- `DELETE /api/tracker/:id` - Remove from tracker

## Tech Stack

### Frontend
- React 19
- Vite 7
- Framer Motion (animations)
- React Router DOM (routing)
- CSS Modules (styling)

### Backend (Planned)
- Node.js
- Express.js
- PostgreSQL
- JWT (authentication)
- bcrypt (password hashing)

### External APIs
- Jikan API (MyAnimeList public API)

## Development Workflow

1. ✅ Frontend structure scaffolded
2. ⏳ Backend structure
3. ⏳ Database setup
4. ⏳ Authentication implementation
5. ⏳ Jikan API integration
6. ⏳ Frontend-Backend connection
7. ⏳ Deployment preparation
