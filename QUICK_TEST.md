# ⚡ Quick Local Test Guide

## 🚀 Servers Starting

Both servers are starting in the background. Wait 10-15 seconds, then:

### 1. Check Servers Are Running

**Backend**: http://localhost:3001/health
- Should return: `{"status":"ok","message":"AniParadise API is running"}`

**Frontend**: http://localhost:5173
- Should show the AniParadise home page

### 2. Quick Test Flow

1. **Open Browser**: http://localhost:5173

2. **Test Home Page**
   - Should see hero section
   - Trending anime should load
   - Genre buttons visible

3. **Test Registration**
   - Click "Register"
   - Fill: username, email, password
   - Submit → Should redirect to home

4. **Test Login**
   - Click "Login"
   - Use registered credentials
   - Submit → Should redirect to home

5. **Test Browse**
   - Click "Browse" in nav
   - Search for "naruto"
   - Click on an anime card

6. **Test Tracker**
   - Go to anime detail
   - Click "Add to Tracker"
   - Go to Tracker page
   - Should see anime in list

7. **Test Profile**
   - Click "Profile" in nav
   - Update display name
   - Save → Should persist

### 3. Check Browser Console

Press F12 → Console tab:
- Should see no red errors
- API calls should succeed (200 status)

### 4. If Issues

**Backend not running?**
```bash
cd backend
npm run dev
```

**Frontend not running?**
```bash
cd frontend
npm run dev
```

**Database error?**
- Check PostgreSQL is running
- Verify database exists: `psql -U postgres -l | findstr aniparadise`
- Run schema if needed: `psql -U postgres -d aniparadise -f database/schema.sql`

---

## ✅ Success = Ready to Deploy!

If everything works:
- ✅ All pages load
- ✅ Can register/login
- ✅ Can browse anime
- ✅ Can use tracker
- ✅ Can update profile
- ✅ No console errors

**→ You're ready to deploy! Follow DEPLOYMENT_GUIDE.md**

---

**Servers should be running now. Open http://localhost:5173 to test! 🎌**
