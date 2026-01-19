# 🚀 AniParadise Deployment Guide

Complete guide for deploying backend and frontend to production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render/Railway)](#backend-deployment)
3. [Database Setup (Managed PostgreSQL)](#database-setup)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

- GitHub account
- Render/Railway account (for backend)
- Vercel account (for frontend)
- PostgreSQL database (managed service)

---

## Backend Deployment

### Option 1: Render (Recommended)

#### Step 1: Prepare Backend for Deployment

1. **Update `backend/package.json` scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

2. **Create `backend/.render.yaml` (optional):**
```yaml
services:
  - type: web
    name: aniparadise-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

#### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aniparadise-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. **Add Environment Variables** (see [Environment Variables](#environment-variables) section)

6. Click **"Create Web Service"**

7. **Note your backend URL**: `https://aniparadise-api.onrender.com` (or similar)

---

### Option 2: Railway

#### Step 1: Prepare Backend

1. Create `backend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 2: Deploy to Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Set **Root Directory** to `backend`
5. Add environment variables
6. Deploy

---

## Database Setup

### Option 1: Render PostgreSQL (Free Tier Available)

1. Go to Render Dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `aniparadise-db`
   - **Database**: `aniparadise`
   - **User**: Auto-generated
   - **Region**: Choose closest to your backend

4. **Note the connection details:**
   - Internal Database URL (for backend on same platform)
   - External Database URL (if backend is elsewhere)

5. **Run Schema:**
   - Go to **"Connect"** tab
   - Use **"psql"** connection string
   - Or use Render's **"Shell"** to run:
   ```bash
   psql $DATABASE_URL -f schema.sql
   ```

### Option 2: Railway PostgreSQL

1. In Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically provides connection string
3. Run schema using Railway's database shell

### Option 3: Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get connection string from **Settings** → **Database**
4. Run schema using Supabase SQL Editor

---

## Frontend Deployment

### Deploy to Vercel

#### Step 1: Prepare Frontend

1. **Create `frontend/.env.production`:**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

2. **Update `frontend/vite.config.js`** (if needed):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ensure proper build output
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

3. **Create `frontend/vercel.json`** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - `VITE_API_URL`: Your backend URL (e.g., `https://aniparadise-api.onrender.com`)

6. Click **"Deploy"**

7. **Note your frontend URL**: `https://aniparadise.vercel.app` (or your custom domain)

---

## Environment Variables

### Backend Environment Variables (Production)

**In Render/Railway Dashboard:**

```env
# Server Configuration
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app

# Database Configuration (from managed PostgreSQL)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important Notes:**
- `DB_SSL=true` for managed PostgreSQL (required)
- `FRONTEND_URL` must match your Vercel frontend URL
- `JWT_SECRET` must be a strong random string (generate with: `openssl rand -hex 32`)
- `PORT` is usually auto-set by platform (Render uses 10000)

### Frontend Environment Variables (Production)

**In Vercel Dashboard:**

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Important:**
- Vite requires `VITE_` prefix for environment variables
- Rebuild required after changing env vars in Vercel

---

## File Structure Changes for Deployment

### Backend Files to Update

1. **`backend/.env`** (Local Development Only)
   - Keep for local development
   - **DO NOT commit to git** (already in .gitignore)
   - Production uses platform environment variables

2. **`backend/package.json`**
   - Ensure `"type": "module"` is set
   - Verify `start` script: `"start": "node src/server.js"`

3. **`backend/src/config/database.js`**
   - Already uses environment variables
   - No changes needed

4. **`backend/src/server.js`**
   - Already uses `process.env.PORT`
   - No changes needed

### Frontend Files to Update

1. **`frontend/.env.production`** (Create this)
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **`frontend/.env.local`** (Local Development)
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. **`frontend/src/services/api.js`**
   - Already uses `import.meta.env.VITE_API_URL`
   - No code changes needed

4. **`frontend/vite.config.js`**
   - Verify build configuration
   - No changes needed if default

---

## Step-by-Step Deployment Process

### Phase 1: Database Setup

1. ✅ Create PostgreSQL database on Render/Railway/Supabase
2. ✅ Note connection details
3. ✅ Run schema: `psql $DATABASE_URL -f database/schema.sql`
4. ✅ Verify tables created: `\dt`

### Phase 2: Backend Deployment

1. ✅ Push code to GitHub
2. ✅ Create new web service on Render/Railway
3. ✅ Connect GitHub repository
4. ✅ Set root directory to `backend`
5. ✅ Add all environment variables
6. ✅ Deploy
7. ✅ Test health endpoint: `https://your-backend.onrender.com/health`
8. ✅ Test API: `https://your-backend.onrender.com/api/anime?q=naruto`

### Phase 3: Frontend Deployment

1. ✅ Create `.env.production` with backend URL
2. ✅ Push to GitHub
3. ✅ Create new project on Vercel
4. ✅ Connect GitHub repository
5. ✅ Set root directory to `frontend`
6. ✅ Add `VITE_API_URL` environment variable
7. ✅ Deploy
8. ✅ Test frontend: `https://your-frontend.vercel.app`

### Phase 4: Update CORS

1. ✅ Update backend `FRONTEND_URL` env var to match Vercel URL
2. ✅ Redeploy backend (if needed)

---

## Post-Deployment Checklist

### Backend Verification

- [ ] Health endpoint works: `https://your-backend.onrender.com/health`
- [ ] Database connection successful (check logs)
- [ ] Anime API works: `https://your-backend.onrender.com/api/anime?q=naruto`
- [ ] Registration works: `POST /api/auth/register`
- [ ] Login works: `POST /api/auth/login`
- [ ] Protected routes require authentication
- [ ] CORS allows frontend domain

### Frontend Verification

- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] API calls work (check browser console)
- [ ] Login/Register functional
- [ ] Navigation works
- [ ] Anime search works
- [ ] Protected routes redirect to login

### Security Checklist

- [ ] `JWT_SECRET` is strong and unique
- [ ] Database password is strong
- [ ] `DB_SSL=true` for production database
- [ ] `.env` files not committed to git
- [ ] CORS only allows your frontend domain
- [ ] No sensitive data in client-side code

---

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify `DB_SSL=true` for managed PostgreSQL
- Check connection string format
- Verify database is accessible from platform

**CORS Errors:**
- Update `FRONTEND_URL` in backend env vars
- Ensure exact match (including https://)
- Redeploy backend after change

**Port Issues:**
- Render uses port 10000 (auto-set)
- Railway uses auto-assigned port
- Don't hardcode port in code

### Frontend Issues

**API Calls Failing:**
- Check `VITE_API_URL` is set correctly
- Verify backend is accessible
- Check browser console for CORS errors
- Rebuild frontend after env var changes

**Build Errors:**
- Ensure all dependencies in `package.json`
- Check Node version compatibility
- Review build logs in Vercel

---

## Environment Variable Reference

### Local Development

**Backend `.env`:**
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_SSL=false
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=7d
```

**Frontend `.env.local`:**
```env
VITE_API_URL=http://localhost:3001
```

### Production

**Backend (Platform Environment Variables):**
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true
JWT_SECRET=production-secret-min-32-chars
JWT_EXPIRES_IN=7d
```

**Frontend (Vercel Environment Variables):**
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## Quick Deploy Commands

### Generate Strong JWT Secret
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Locally Before Deploy
```bash
cd backend
npm run dev
# Test: http://localhost:3001/health
```

### Test Frontend Build Locally
```bash
cd frontend
npm run build
npm run preview
# Test: http://localhost:4173
```

---

## Deployment Platforms Summary

| Service | Backend | Frontend | Database | Free Tier |
|---------|---------|----------|----------|-----------|
| Render | ✅ | ✅ | ✅ | Yes |
| Railway | ✅ | ✅ | ✅ | Limited |
| Vercel | ❌ | ✅ | ❌ | Yes |
| Supabase | ❌ | ❌ | ✅ | Yes |

**Recommended Setup:**
- **Backend**: Render (free tier available)
- **Frontend**: Vercel (excellent for React/Vite)
- **Database**: Render PostgreSQL or Supabase

---

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring/logging
4. ✅ Set up CI/CD (automatic deployments)
5. ✅ Add error tracking (Sentry, etc.)
6. ✅ Performance monitoring

---

**🎉 Your AniParadise app is now live!**
