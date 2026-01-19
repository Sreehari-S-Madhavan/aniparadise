/**
 * Anime Routes (Jikan API Proxy)
 * GET /api/anime - Search/list anime
 * GET /api/anime/:id - Get anime details
 */

import express from 'express';

const router = express.Router();
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

/**
 * Search or list anime
 * GET /api/anime?q=search&page=1&limit=20
 */
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    let url;
    if (q) {
      // Search anime
      url = `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
    } else {
      // Get top/popular anime
      url = `${JIKAN_API_BASE}/top/anime?page=${page}&limit=${limit}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Anime search error:', error);
    res.status(500).json({ error: 'Failed to fetch anime data' });
  }
});

/**
 * Get anime by ID
 * GET /api/anime/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `${JIKAN_API_BASE}/anime/${id}/full`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Anime not found' });
      }
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Anime detail error:', error);
    res.status(500).json({ error: 'Failed to fetch anime details' });
  }
});

export default router;
