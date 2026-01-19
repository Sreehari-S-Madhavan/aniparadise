# AniParadise Setup Checklist

## ✅ Pre-Setup Verification

### 1. Environment Variables (.env)
- [ ] `.env` file exists in `backend/` directory
- [ ] `DB_PASSWORD` is set (your PostgreSQL password)
- [ ] `JWT_SECRET` is set (strong random string, min 32 chars)
- [ ] `DB_NAME=aniparadise`
- [ ] `DB_USER=postgres` (or your PostgreSQL username)
- [ ] `PORT=3001` (or your preferred port)
- [ ] `FRONTEND_URL=http://localhost:5173` (matches your frontend port)

### 2. PostgreSQL Database
- [ ] PostgreSQL is installed and running
- [ ] Database `aniparadise` exists
  ```sql
  CREATE DATABASE aniparadise;
  ```
- [ ] Schema has been run
  ```bash
  psql -U postgres -d aniparadise -f database/schema.sql
  ```

### 3. Backend Dependencies
- [ ] All npm packages installed
  ```bash
  cd backend
  npm install
  ```

### 4. Frontend Dependencies
- [ ] All npm packages installed
  ```bash
  cd frontend
  npm install
  ```

## 🚀 Startup Steps

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 AniParadise API server running on port 3001
```

**If you see database connection error:**
- Check PostgreSQL is running
- Verify DB_PASSWORD in .env
- Ensure database exists

### Step 2: Test Backend Health
Open browser or use curl:
```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "AniParadise API is running"
}
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🧪 Quick API Tests

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Anime Search (Jikan Proxy)
```bash
curl http://localhost:3001/api/anime?q=naruto&limit=5
```

## 📋 Common Issues & Solutions

### Issue: Database Connection Error
**Solution:**
1. Check PostgreSQL service is running
2. Verify credentials in .env
3. Test connection: `psql -U postgres -d aniparadise`

### Issue: Port Already in Use
**Solution:**
- Change PORT in .env to different port (e.g., 3002)
- Or kill process using port: `netstat -ano | findstr :3001`

### Issue: CORS Errors
**Solution:**
- Verify FRONTEND_URL in .env matches actual frontend URL
- Check frontend is running on specified port

### Issue: JWT Secret Warning
**Solution:**
- Set strong JWT_SECRET in .env (min 32 characters)
- Use random string generator

## ✅ Next Steps After Setup

1. ✅ Backend running and healthy
2. ✅ Frontend running
3. ✅ Database connected
4. ⏳ Build frontend pages (Home, Anime Detail, Tracker, Profile)
5. ⏳ Connect frontend to backend API
6. ⏳ Test full user flow (register → login → track anime)

## 📚 Documentation Files

- `backend/README.md` - Backend API documentation
- `backend/ENV_SETUP.md` - Environment variables guide
- `database/README.md` - Database setup guide
- `PROFILE_FEATURES.md` - Profile features documentation
- `BACKEND_SETUP.md` - Backend setup summary
