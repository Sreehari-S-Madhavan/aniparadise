-- Migration: Add profile fields to existing users table
-- Run this if you already have a users table without profile fields

-- Add profile columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS favorite_genres JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Update existing users to have display_name = username if null
UPDATE users 
SET display_name = username 
WHERE display_name IS NULL;
