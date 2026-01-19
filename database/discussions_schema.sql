-- Discussions Schema for AniParadise
-- Tables for discussions/community system

-- Discussions table (main posts)
CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general', -- 'anime', 'manga', 'theory', 'review', 'general'
  anime_id INTEGER, -- Optional reference to specific anime
  image_url VARCHAR(500), -- Optional image for post
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion comments
CREATE TABLE IF NOT EXISTS discussion_comments (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion likes (for tracking who liked what)
CREATE TABLE IF NOT EXISTS discussion_likes (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(discussion_id, user_id) -- One like per user per discussion
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_user_id ON discussion_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_likes_discussion_id ON discussion_likes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_likes_user_id ON discussion_likes(user_id);

-- Triggers to auto-update updated_at
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_comments_updated_at BEFORE UPDATE ON discussion_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update likes count when a like is added/removed
CREATE OR REPLACE FUNCTION update_discussion_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussions SET likes_count = likes_count + 1 WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussions SET likes_count = likes_count - 1 WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update likes count
CREATE TRIGGER update_likes_count_on_like
  AFTER INSERT OR DELETE ON discussion_likes
  FOR EACH ROW EXECUTE FUNCTION update_discussion_likes_count();

-- Function to update comments count when a comment is added/removed
CREATE OR REPLACE FUNCTION update_discussion_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussions SET comments_count = comments_count + 1 WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussions SET comments_count = comments_count - 1 WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update comments count
CREATE TRIGGER update_comments_count_on_comment
  AFTER INSERT OR DELETE ON discussion_comments
  FOR EACH ROW EXECUTE FUNCTION update_discussion_comments_count();
