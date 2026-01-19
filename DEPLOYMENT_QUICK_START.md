# 🚀 Quick Deployment Guide

Fast-track deployment checklist for AniParadise.

## ⚡ 5-Minute Deployment

### 1. Database (2 minutes)

**Render PostgreSQL:**
1. Render Dashboard → New → PostgreSQL
2. Name: `aniparadise-db`
3. Copy connection string
4. Run schema in Shell:
   ```bash
   psql $DATABASE_URL -f database/schema.sql
   ```

### 2. Backend (2 minutes)

**Render Web Service:**
1. New → Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Environment Variables:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   DB_HOST=(from PostgreSQL)
   DB_PORT=5432
   DB_NAME=aniparadise
   DB_USER=(from PostgreSQL)
   DB_PASSWORD=(from PostgreSQL)
   DB_SSL=true
   JWT_SECRET=(generate with: openssl rand -hex 32)
   JWT_EXPIRES_IN=7d
   ```
5. Deploy → Copy backend URL

### 3. Frontend (1 minute)

**Vercel:**
1. New Project → Import repo
2. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
3. Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Deploy → Update backend `FRONTEND_URL` → Redeploy backend

## ✅ Done!

Test: `https://your-frontend.vercel.app`
