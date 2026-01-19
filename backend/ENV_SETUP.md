# Environment Variables Setup Guide

## Required .env Variables

Create a `.env` file in the `backend/` directory with the following variables:

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
DB_PASSWORD=your_actual_password_here
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

## Variable Descriptions

### Server Configuration
- `PORT` - Backend server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment mode: `development` or `production`

### Database Configuration
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: aniparadise)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - **REQUIRED** - Your PostgreSQL password
- `DB_SSL` - Use SSL connection (default: false, set to `true` for cloud databases)

### JWT Configuration
- `JWT_SECRET` - **IMPORTANT** - Secret key for JWT tokens (use a strong random string in production)
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)

## Setup Steps

1. **Create .env file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit .env file:**
   - Set `DB_PASSWORD` to your PostgreSQL password
   - Change `JWT_SECRET` to a strong random string (at least 32 characters)
   - Update `FRONTEND_URL` if your frontend runs on a different port

3. **Verify database exists:**
   ```bash
   psql -U postgres -l
   # Look for 'aniparadise' database
   ```

4. **Run database schema:**
   ```bash
   psql -U postgres -d aniparadise -f ../database/schema.sql
   ```

5. **Test backend:**
   ```bash
   npm run dev
   ```

## Security Notes

- **Never commit .env file to git** (it's in .gitignore)
- Use strong, random JWT_SECRET in production
- Change default passwords
- Use SSL for database in production (`DB_SSL=true`)

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DB_PASSWORD is correct
- Ensure database `aniparadise` exists
- Check DB_HOST and DB_PORT are correct

### Port Already in Use
- Change PORT in .env to a different port
- Or stop the process using port 3001

### CORS Errors
- Update FRONTEND_URL to match your frontend URL
- Check frontend is running on the specified port
