# 🎌 AniParadise

**Your Ultimate Anime Hub** - Discover, track, and manage your favorite anime in one beautiful platform.

![AniParadise](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)
![Backend](https://img.shields.io/badge/Backend-Express.js-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 📺 **Anime Discovery** - Search and browse thousands of anime from Jikan API
- 📊 **Personal Tracker** - Track your watch status (watching, completed, on-hold, etc.)
- 👤 **User Profiles** - Customize your profile with bio, favorite genres, and more
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🚀 **Fast & Responsive** - Optimized for performance and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite 7
- Framer Motion (animations)
- React Router DOM
- CSS Modules

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Jikan API Integration

## 📁 Project Structure

```
aniparadise/
├── backend/          # Express.js API server
├── frontend/         # React + Vite application
├── database/         # PostgreSQL schema and migrations
└── design/           # UI/UX design files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aniparadise
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Set up Database**
   ```bash
   # Create database
   createdb aniparadise
   
   # Run schema
   psql -U postgres -d aniparadise -f ../database/schema.sql
   ```

4. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** - Fast deployment guide
- **[DEPLOYMENT_ENV_VARS.md](./DEPLOYMENT_ENV_VARS.md)** - Environment variables reference
- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Project completion summary
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[database/README.md](./database/README.md)** - Database setup guide

## 🌐 Deployment

### Recommended Platforms
- **Backend**: Render or Railway
- **Frontend**: Vercel
- **Database**: Render PostgreSQL or Supabase

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed deployment instructions.

## 🧪 Testing

### Backend API Tests
```bash
cd backend
node test-api.js
```

### Manual Testing
1. Register a new user
2. Login and get JWT token
3. Browse anime
4. Add anime to tracker
5. Update profile

## 📝 API Endpoints

### Public
- `GET /health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/anime` - Search/list anime
- `GET /api/anime/:id` - Get anime details

### Protected (Require JWT)
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `GET /api/tracker` - Get tracker list
- `POST /api/tracker` - Add to tracker
- `PUT /api/tracker/:id` - Update tracker
- `DELETE /api/tracker/:id` - Remove from tracker

## 🎨 Design System

- **Primary Color**: #47ebeb (Cyan)
- **Accent Colors**: #C580E6 (Purple), #E680BC (Pink)
- **Font**: Spline Sans
- **Icons**: Material Symbols Outlined
- **Theme**: Dark mode

## 📄 License

ISC

## 👨‍💻 Development

Built with modern web technologies following best practices:
- RESTful API design
- JWT authentication
- Responsive mobile-first design
- Performance optimization
- Clean code architecture

## 🎯 Status

✅ **Project Complete** - All features implemented and tested
✅ **Ready for Deployment** - Follow deployment guide to go live
✅ **Production Ready** - Code is clean, tested, and documented

---

**Made with ❤️ for anime fans everywhere!**

For questions or issues, check the documentation files or open an issue.
