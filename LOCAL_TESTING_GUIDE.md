# 🧪 Local Testing Guide

Complete guide for testing AniParadise locally before deployment.

## Prerequisites Check

### 1. Database Setup
```bash
# Check if PostgreSQL is running
psql --version

# Check if database exists
psql -U postgres -l | findstr aniparadise
```

### 2. Backend Setup
```bash
cd backend
npm install  # If not already done
```

### 3. Frontend Setup
```bash
cd frontend
npm install  # If not already done
```

## 🚀 Starting the Application

### Step 1: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🚀 AniParadise API server running on port 3001
```

**If you see database connection error:**
- Check PostgreSQL is running
- Verify `.env` has correct `DB_PASSWORD`
- Ensure database `aniparadise` exists
- Run schema: `psql -U postgres -d aniparadise -f ../database/schema.sql`

### Step 2: Start Frontend Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser

Open: **http://localhost:5173**

---

## ✅ Testing Checklist

### 1. Home Page
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] Trending anime carousel loads
- [ ] Genre buttons display
- [ ] Navigation works

### 2. Browse Page
- [ ] Search bar works
- [ ] Anime grid displays
- [ ] Genre filters work
- [ ] Clicking anime card navigates to detail

### 3. Anime Detail Page
- [ ] Anime information displays
- [ ] Stats show correctly
- [ ] Synopsis displays
- [ ] "Add to Tracker" button visible

### 4. Authentication
- [ ] Register page loads
- [ ] Can register new user
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] Token stored in localStorage
- [ ] Protected routes redirect to login when not authenticated

### 5. Tracker (After Login)
- [ ] Tracker page loads
- [ ] Can add anime to tracker
- [ ] Tracker list displays
- [ ] Status filters work
- [ ] Can update tracker status

### 6. Profile (After Login)
- [ ] Profile page loads
- [ ] Can view profile information
- [ ] Can update profile fields
- [ ] Changes save successfully
- [ ] Logout works

### 7. Navigation
- [ ] All links work
- [ ] Search in header works
- [ ] User menu displays when logged in
- [ ] Logout button works

---

## 🧪 Manual Test Scenarios

### Test 1: New User Flow
1. Open http://localhost:5173
2. Click "Register"
3. Fill in: username, email, password
4. Submit → Should redirect to home
5. Check navigation shows user menu

### Test 2: Browse & Search
1. Click "Browse" in navigation
2. Search for "naruto"
3. Verify results display
4. Click on an anime card
5. Verify detail page loads

### Test 3: Add to Tracker
1. Login (if not already)
2. Go to anime detail page
3. Select status (watching, completed, etc.)
4. Click "Add to Tracker"
5. Go to Tracker page
6. Verify anime appears in list

### Test 4: Update Profile
1. Go to Profile page
2. Update display name
3. Add bio
4. Select favorite genres
5. Click "Save Profile"
6. Verify changes saved

### Test 5: Tracker Management
1. Go to Tracker page
2. Filter by "completed"
3. Change status of an item
4. Verify status updates
5. Filter by different status

---

## 🔍 Browser Console Checks

Open browser DevTools (F12) and check:

### No Errors
- Console should show no red errors
- Network tab should show successful API calls (200 status)

### API Calls
- Registration: `POST /api/auth/register` → 201
- Login: `POST /api/auth/login` → 200
- Anime search: `GET /api/anime?q=...` → 200
- Tracker: `GET /api/tracker` → 200 (with auth)

### LocalStorage
- After login, check localStorage:
  - `token` should exist
  - `user` should contain user object

---

## 🐛 Common Issues & Fixes

### Issue: "Database connection error"
**Fix:**
```bash
# Start PostgreSQL service
# Windows: Check Services app
# Or: net start postgresql-x64-XX

# Create database if missing
psql -U postgres -c "CREATE DATABASE aniparadise;"

# Run schema
psql -U postgres -d aniparadise -f database/schema.sql
```

### Issue: "CORS error"
**Fix:**
- Check backend `FRONTEND_URL` in `.env` is `http://localhost:5173`
- Restart backend server

### Issue: "API calls failing"
**Fix:**
- Check backend is running on port 3001
- Check `VITE_API_URL` in frontend (should be `http://localhost:3001`)
- Check browser console for errors

### Issue: "Page not found"
**Fix:**
- Check React Router routes in `App.jsx`
- Verify all page components exist

### Issue: "Token not working"
**Fix:**
- Clear localStorage: `localStorage.clear()`
- Login again
- Check token in localStorage

---

## 📊 Test Results Template

```
Local Testing Results
=====================

Date: ___________

Backend:
- [ ] Server starts successfully
- [ ] Database connects
- [ ] Health endpoint works
- [ ] All API endpoints respond

Frontend:
- [ ] Dev server starts
- [ ] No console errors
- [ ] All pages load
- [ ] Navigation works

Authentication:
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes work

Features:
- [ ] Anime search works
- [ ] Anime detail loads
- [ ] Add to tracker works
- [ ] Tracker list displays
- [ ] Profile updates work

Issues Found:
1. ________________
2. ________________

Status: ✅ Ready / ⚠️ Needs Fixes
```

---

## 🎯 Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:3001/health
```

### Test Anime Search
```bash
curl http://localhost:3001/api/anime?q=naruto&limit=3
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

---

## ✅ Success Criteria

Your app is ready if:
- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Can register and login
- ✅ Can browse anime
- ✅ Can add to tracker
- ✅ Can update profile
- ✅ No console errors
- ✅ All pages load correctly

---

## 🚀 After Local Testing

Once everything works locally:
1. ✅ Fix any issues found
2. ✅ Test all features again
3. ✅ Review deployment guide
4. ✅ Deploy to production!

---

**Ready to test? Start with Step 1 above!**
