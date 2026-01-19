# Environment Variables Reference

Complete reference for all environment variables needed for deployment.

## 🔧 Backend Environment Variables

### Required Variables

| Variable | Description | Example (Local) | Example (Production) |
|----------|-------------|-----------------|----------------------|
| `PORT` | Server port | `3001` | `10000` (auto-set on Render) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | `https://aniparadise.vercel.app` |
| `NODE_ENV` | Environment mode | `development` | `production` |
| `DB_HOST` | PostgreSQL host | `localhost` | `dpg-xxxxx-a.oregon-postgres.render.com` |
| `DB_PORT` | PostgreSQL port | `5432` | `5432` |
| `DB_NAME` | Database name | `aniparadise` | `aniparadise` |
| `DB_USER` | Database user | `postgres` | `aniparadise_user` |
| `DB_PASSWORD` | Database password | `your_password` | `auto-generated` |
| `DB_SSL` | Use SSL connection | `false` | `true` (required for managed DB) |
| `JWT_SECRET` | JWT signing secret | `dev-secret` | `generate-strong-random-32-chars` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` | `7d` |

### Where to Set

**Local Development:**
- File: `backend/.env`
- Format: `KEY=value`

**Production (Render):**
- Dashboard → Your Service → Environment
- Add each variable individually

**Production (Railway):**
- Dashboard → Your Service → Variables
- Add each variable individually

## 🎨 Frontend Environment Variables

### Required Variables

| Variable | Description | Example (Local) | Example (Production) |
|----------|-------------|-----------------|----------------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` | `https://aniparadise-api.onrender.com` |

**Important:** Vite requires `VITE_` prefix for environment variables to be exposed to client code.

### Where to Set

**Local Development:**
- File: `frontend/.env.local`
- Format: `VITE_API_URL=http://localhost:3001`

**Production (Vercel):**
- Dashboard → Your Project → Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-backend.onrender.com`

## 📝 Environment File Templates

### Backend `.env` (Local)

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Backend Production (Platform Environment Variables)

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://aniparadise.vercel.app
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=aniparadise_user
DB_PASSWORD=your_auto_generated_password
DB_SSL=true
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Frontend `.env.local` (Local)

```env
VITE_API_URL=http://localhost:3001
```

### Frontend Production (Vercel Environment Variables)

```env
VITE_API_URL=https://aniparadise-api.onrender.com
```

## 🔐 Security Best Practices

### JWT Secret Generation

**Linux/Mac:**
```bash
openssl rand -hex 32
```

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Online:**
- Use a secure random string generator
- Minimum 32 characters
- Mix of letters, numbers, symbols

### Database Password

- Use auto-generated passwords from managed services
- Never commit passwords to git
- Rotate passwords periodically

### Environment Variable Security

✅ **DO:**
- Use platform environment variables for production
- Keep `.env` files in `.gitignore`
- Use different secrets for dev/prod
- Rotate secrets periodically

❌ **DON'T:**
- Commit `.env` files to git
- Share secrets in chat/email
- Use weak secrets
- Reuse secrets across projects

## 🔄 Updating Environment Variables

### Backend (Render)

1. Go to Dashboard → Your Service
2. Click **"Environment"** tab
3. Add/Edit variables
4. Click **"Save Changes"**
5. Service auto-redeploys

### Frontend (Vercel)

1. Go to Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add/Edit variables
4. Click **"Save"**
5. **Redeploy** (Vercel doesn't auto-redeploy on env var changes)

## 🧪 Testing Environment Variables

### Backend

```bash
# Check if variables are loaded
cd backend
node -e "require('dotenv').config(); console.log(process.env.DB_HOST)"
```

### Frontend

```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL)
```

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] All required environment variables set
- [ ] `DB_SSL=true` for production database
- [ ] `FRONTEND_URL` matches actual frontend URL
- [ ] `JWT_SECRET` is strong and unique
- [ ] `VITE_API_URL` points to backend
- [ ] No `.env` files committed to git
- [ ] Production `NODE_ENV=production`

## 🆘 Troubleshooting

### "Database connection error"
- Check `DB_SSL=true` for managed PostgreSQL
- Verify connection string format
- Check database is accessible

### "CORS error"
- Verify `FRONTEND_URL` matches exactly (including https://)
- No trailing slash
- Redeploy backend after change

### "API calls failing"
- Check `VITE_API_URL` is set correctly
- Rebuild frontend after env var changes
- Verify backend is accessible

### "Environment variable not found"
- Check variable name spelling
- Verify `VITE_` prefix for frontend
- Rebuild/redeploy after changes
