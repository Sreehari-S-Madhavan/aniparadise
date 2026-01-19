# AniParadise Backend API

## Overview
Express.js REST API for AniParadise anime tracking application.

## Tech Stack
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (raw SQL, no ORM)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jikan API** - External anime data source

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Required variables:
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL config
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)

### 3. Database Setup
See `../database/README.md` for database setup instructions.

### 4. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Anime (Jikan Proxy)
- `GET /api/anime` - Search/list anime (query: `?q=search&page=1&limit=20`)
- `GET /api/anime/:id` - Get anime details

### Tracker (Protected)
- `GET /api/tracker` - Get user's tracker list (query: `?status=watching`)
- `POST /api/tracker` - Add anime to tracker
- `PUT /api/tracker/:id` - Update tracker entry
- `DELETE /api/tracker/:id` - Remove from tracker

### Profile (Protected)
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update current user's profile (can update: display_name, bio, avatar_url, favorite_genres, location, website, birth_date, password)

### Health Check
- `GET /health` - Server health status

## Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── anime.js         # Jikan API proxy routes
│   │   ├── tracker.js       # Tracker CRUD routes
│   │   └── profile.js       # User profile routes
│   ├── utils/
│   │   └── jwt.js           # JWT helper functions
│   └── server.js            # Express app entry point
├── .env.example             # Environment variables template
└── package.json
```

## Development

The server uses ES modules (`"type": "module"`). All imports use ES6 syntax.

## Deployment

For production:
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Enable SSL for database if using cloud provider
4. Configure CORS for production frontend URL
