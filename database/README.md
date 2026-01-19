# AniParadise Database Setup

## PostgreSQL Setup

### 1. Install PostgreSQL
Make sure PostgreSQL is installed on your system.

### 2. Create Database
```sql
CREATE DATABASE aniparadise;
```

### 3. Run Schema
```bash
psql -U postgres -d aniparadise -f schema.sql
```

Or using psql:
```bash
psql -U postgres -d aniparadise
\i schema.sql
```

## Database Schema

### Tables

#### `users`
- `id` - Primary key (SERIAL)
- `username` - Unique username (VARCHAR 50)
- `email` - Unique email (VARCHAR 255)
- `password_hash` - Bcrypt hashed password (VARCHAR 255)
- `display_name` - Display name (VARCHAR 100, defaults to username)
- `bio` - User biography/description (TEXT)
- `avatar_url` - Profile picture URL (VARCHAR 500)
- `favorite_genres` - Array of favorite genres (JSONB, default: [])
- `location` - User location (VARCHAR 100)
- `website` - Personal website URL (VARCHAR 255)
- `birth_date` - Date of birth (DATE)
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `tracker`
- `id` - Primary key (SERIAL)
- `user_id` - Foreign key to users (INTEGER)
- `anime_id` - Jikan API anime ID (INTEGER)
- `status` - Watch status: 'watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Indexes
- `idx_tracker_user_id` - For fast user tracker queries
- `idx_tracker_status` - For filtering by status
- `idx_tracker_anime_id` - For anime lookups
- `idx_users_email` - For login queries
- `idx_users_username` - For username lookups

## Environment Variables

Set these in your `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aniparadise
DB_USER=postgres
DB_PASSWORD=your_password
```

## Migration

If you already have a users table without profile fields, run:
```bash
psql -U postgres -d aniparadise -f migration_add_profile_fields.sql
```

## Notes

- All anime data comes from Jikan API (not stored locally)
- Only user tracking data and profiles are stored in PostgreSQL
- Foreign key constraints ensure data integrity
- Auto-updating timestamps via triggers
- `favorite_genres` is stored as JSONB array (e.g., ["Action", "Sci-Fi", "Romance"])
