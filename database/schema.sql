-- AniParadise Database Schema
-- PostgreSQL database schema for user authentication and anime tracking

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  -- Profile fields
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  favorite_genres JSONB DEFAULT '[]'::jsonb,
  location VARCHAR(100),
  website VARCHAR(255),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracker table (user's anime watch list)
CREATE TABLE IF NOT EXISTS tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracker_user_id ON tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_status ON tracker(status);
CREATE INDEX IF NOT EXISTS idx_tracker_anime_id ON tracker(anime_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tracker_updated_at ON tracker;
CREATE TRIGGER update_tracker_updated_at BEFORE UPDATE ON tracker
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
