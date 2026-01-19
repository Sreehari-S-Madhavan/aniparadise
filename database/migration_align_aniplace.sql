-- Migration to align with Aniplace reference functionalities

-- 1. Update tracker table with progress, rating, and notes
ALTER TABLE tracker ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE tracker ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 10);
ALTER TABLE tracker ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create platforms table for 'Where to Watch'
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  website_url VARCHAR(255),
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create anime_platforms table (junction table)
CREATE TABLE IF NOT EXISTS anime_platforms (
  id SERIAL PRIMARY KEY,
  anime_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  url VARCHAR(500), -- Direct link to anime on platform
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(anime_id, platform_id)
);

-- 4. Add triggers for updated_at on new tables
CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anime_platforms_updated_at BEFORE UPDATE ON anime_platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Seed sample platforms (Optional but helpful for 'Where to Watch' tab)
INSERT INTO platforms (name, display_name, website_url) VALUES
('crunchyroll', 'Crunchyroll', 'https://crunchyroll.com') ON CONFLICT (name) DO NOTHING;
INSERT INTO platforms (name, display_name, website_url) VALUES
('netflix', 'Netflix', 'https://netflix.com') ON CONFLICT (name) DO NOTHING;
INSERT INTO platforms (name, display_name, website_url) VALUES
('hulu', 'Hulu', 'https://hulu.com') ON CONFLICT (name) DO NOTHING;
INSERT INTO platforms (name, display_name, website_url) VALUES
('amazon_prime', 'Amazon Prime', 'https://primevideo.com') ON CONFLICT (name) DO NOTHING;
INSERT INTO platforms (name, display_name, website_url) VALUES
('disney_plus', 'Disney+', 'https://disneyplus.com') ON CONFLICT (name) DO NOTHING;
