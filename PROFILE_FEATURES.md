# User Profile Features ✅

## Overview
User profile functionality has been added to AniParadise, allowing users to customize their profiles with additional information.

## Database Changes

### Updated `users` Table
Added the following profile fields:
- `display_name` (VARCHAR 100) - Custom display name (defaults to username)
- `bio` (TEXT) - User biography/description
- `avatar_url` (VARCHAR 500) - Profile picture URL
- `favorite_genres` (JSONB) - Array of favorite anime genres (default: [])
- `location` (VARCHAR 100) - User location
- `website` (VARCHAR 255) - Personal website URL
- `birth_date` (DATE) - Date of birth

## API Endpoints

### GET /api/profile
Get current user's profile (requires authentication)

**Response:**
```json
{
  "profile": {
    "id": 1,
    "username": "animefan",
    "email": "user@example.com",
    "display_name": "Anime Fan",
    "bio": "Love watching anime!",
    "avatar_url": "https://example.com/avatar.jpg",
    "favorite_genres": ["Action", "Sci-Fi", "Romance"],
    "location": "Tokyo, Japan",
    "website": "https://mywebsite.com",
    "birth_date": "1990-01-01",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/profile
Update current user's profile (requires authentication)

**Request Body (all fields optional):**
```json
{
  "display_name": "New Display Name",
  "bio": "Updated bio text",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "favorite_genres": ["Action", "Fantasy", "Comedy"],
  "location": "New York, USA",
  "website": "https://newsite.com",
  "birth_date": "1995-05-15",
  "password": "newpassword123",
  "current_password": "oldpassword123"
}
```

**Note:** To change password, both `password` and `current_password` must be provided.

**Response:**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    // Updated profile object
  }
}
```

## Migration

If you already have a database with users table, run the migration:

```bash
psql -U postgres -d aniparadise -f database/migration_add_profile_fields.sql
```

This will:
- Add all profile columns to existing users table
- Set `display_name` to `username` for existing users
- Set default `favorite_genres` to empty array `[]`

## Updated Authentication Responses

### Register Response
Now includes `display_name`:
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "animefan",
    "email": "user@example.com",
    "display_name": "animefan"
  },
  "token": "jwt_token_here"
}
```

### Login Response
Now includes `display_name`:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "animefan",
    "email": "user@example.com",
    "display_name": "animefan"
  },
  "token": "jwt_token_here"
}
```

## Profile Features

### Display Name
- Users can set a custom display name different from username
- Defaults to username if not set
- Can be updated via profile endpoint

### Bio
- Free-form text field for user description
- Optional field

### Avatar URL
- URL to user's profile picture
- Frontend can use this to display user avatars
- Optional field

### Favorite Genres
- Stored as JSONB array
- Example: `["Action", "Sci-Fi", "Romance", "Fantasy"]`
- Can be used for recommendations or filtering

### Location
- User's location (city, country, etc.)
- Optional field

### Website
- Personal website or social media link
- Optional field

### Birth Date
- Date of birth
- Can be used for age calculations or birthday features
- Optional field

### Password Update
- Users can update their password
- Requires current password verification
- New password must be at least 6 characters

## Security

- All profile endpoints require JWT authentication
- Users can only view/update their own profile
- Password changes require current password verification
- All fields are validated before update

## Usage Example

```javascript
// Get profile
const response = await fetch('http://localhost:3001/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { profile } = await response.json();

// Update profile
const updateResponse = await fetch('http://localhost:3001/api/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    display_name: 'Anime Master',
    bio: 'Passionate anime watcher',
    favorite_genres: ['Action', 'Sci-Fi', 'Fantasy']
  })
});
```

## Status: ✅ Complete
Profile functionality is fully implemented and ready to use!
