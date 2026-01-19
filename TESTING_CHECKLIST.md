# ✅ Local Testing Checklist

Use this checklist to systematically test your AniParadise application.

## 🚀 Server Status

### Backend
- [ ] Backend server running on http://localhost:3001
- [ ] Health endpoint responds: `{"status":"ok","message":"AniParadise API is running"}`
- [ ] Database connection successful (check backend console)

### Frontend
- [ ] Frontend server running on http://localhost:5173
- [ ] No build errors in console
- [ ] Page loads without errors

---

## 🧪 Feature Testing

### 1. Home Page
- [ ] Page loads at http://localhost:5173
- [ ] Navigation header displays
- [ ] Hero section shows "Discover Your Next Favorite Anime"
- [ ] Trending anime carousel loads (8 anime cards)
- [ ] Genre buttons display (Shonen, Cyberpunk, etc.)
- [ ] All links work

### 2. Browse/Search Page
- [ ] Navigate to /browse
- [ ] Search bar displays
- [ ] Type "naruto" and press Enter
- [ ] Anime results display in grid
- [ ] Click on an anime card
- [ ] Navigates to anime detail page

### 3. Anime Detail Page
- [ ] Hero image displays
- [ ] Anime title shows
- [ ] Stats display (Rating, Ranking, Popularity, Episodes)
- [ ] Synopsis section shows
- [ ] "Add to Tracker" button visible
- [ ] Sidebar with anime info displays

### 4. Registration
- [ ] Click "Register" in navigation
- [ ] Form displays (Username, Email, Password)
- [ ] Fill in test data:
  - Username: `testuser123`
  - Email: `test@example.com`
  - Password: `test123456`
- [ ] Submit form
- [ ] Should redirect to home page
- [ ] Navigation should show user menu (not Login/Register)

### 5. Login
- [ ] Click "Logout" (if logged in)
- [ ] Click "Login" in navigation
- [ ] Enter credentials:
  - Email: `test@example.com`
  - Password: `test123456`
- [ ] Submit form
- [ ] Should redirect to home
- [ ] Should be logged in

### 6. Tracker (After Login)
- [ ] Navigate to /tracker
- [ ] Page loads (may be empty initially)
- [ ] Status filters display (Watching, Completed, etc.)
- [ ] Go to anime detail page
- [ ] Select status: "Watching"
- [ ] Click "Add to Tracker"
- [ ] Success message appears
- [ ] Go back to /tracker
- [ ] Anime appears in list
- [ ] Change status filter
- [ ] List updates correctly

### 7. Profile (After Login)
- [ ] Navigate to /profile
- [ ] Profile information displays
- [ ] Update display name
- [ ] Add bio text
- [ ] Select favorite genres (checkboxes)
- [ ] Click "Save Profile"
- [ ] Success message appears
- [ ] Refresh page
- [ ] Changes persist

### 8. Navigation
- [ ] All navigation links work
- [ ] Search in header works (navigates to /browse)
- [ ] User avatar/icon shows when logged in
- [ ] Logout button works
- [ ] After logout, redirects to home

---

## 🔍 Browser Console Checks

Open DevTools (F12) → Console tab:

- [ ] No red errors
- [ ] No warnings (yellow) about missing dependencies
- [ ] API calls show in Network tab
- [ ] All API responses are 200 (or 201 for create)

### Check LocalStorage
Open DevTools → Application → Local Storage → http://localhost:5173:

- [ ] After login: `token` exists
- [ ] After login: `user` object exists
- [ ] After logout: Both cleared

---

## 🐛 Common Issues to Watch For

### Database Issues
- ❌ "Database connection error" in backend console
  - **Fix**: Check PostgreSQL is running, verify DB_PASSWORD

### CORS Issues
- ❌ "CORS policy" error in browser console
  - **Fix**: Check backend `.env` has `FRONTEND_URL=http://localhost:5173`

### API Issues
- ❌ "Failed to fetch" errors
  - **Fix**: Check backend is running, check `VITE_API_URL` in frontend

### Routing Issues
- ❌ "404" on page navigation
  - **Fix**: Check React Router routes in `App.jsx`

---

## ✅ Success Indicators

Your app is working correctly if:

1. ✅ Both servers start without errors
2. ✅ Home page loads with trending anime
3. ✅ Can register new user
4. ✅ Can login with credentials
5. ✅ Can browse and search anime
6. ✅ Can view anime details
7. ✅ Can add anime to tracker (when logged in)
8. ✅ Can view tracker list
9. ✅ Can update profile
10. ✅ No console errors
11. ✅ All API calls succeed

---

## 📝 Test Results

**Date**: ___________

**Backend Status**: ✅ Working / ❌ Issues
**Frontend Status**: ✅ Working / ❌ Issues

**Issues Found**:
1. ________________
2. ________________

**Overall Status**: ✅ Ready for Deployment / ⚠️ Needs Fixes

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Fix any issues found
2. ✅ Review deployment guide
3. ✅ Deploy to production!

If issues found:
1. ✅ Check error messages
2. ✅ Review troubleshooting in `LOCAL_TESTING_GUIDE.md`
3. ✅ Fix issues
4. ✅ Re-test

---

**Happy Testing! 🎌**
