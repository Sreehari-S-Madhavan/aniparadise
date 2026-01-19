/**
 * Platforms Routes
 * API endpoints for streaming platforms and availability
 */

import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * Get all available platforms
 * GET /api/platforms
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM platforms ORDER BY display_name ASC'
        );
        res.json({ platforms: result.rows });
    } catch (error) {
        console.error('Get platforms error:', error);
        res.status(500).json({ error: 'Failed to fetch platforms' });
    }
});

/**
 * Get platforms where a specific anime is available
 * GET /api/platforms/anime/:animeId
 */
router.get('/anime/:animeId', async (req, res) => {
    try {
        const { animeId } = req.params;

        const result = await pool.query(
            `SELECT p.*, ap.url as platform_url
       FROM platforms p
       JOIN anime_platforms ap ON p.id = ap.platform_id
       WHERE ap.anime_id = $1`,
            [animeId]
        );

        res.json({ platforms: result.rows });
    } catch (error) {
        console.error('Get anime platforms error:', error);
        res.status(500).json({ error: 'Failed to fetch anime platforms' });
    }
});

/**
 * Add platform to an anime (Admin/Manual for now)
 * POST /api/platforms/anime
 */
router.post('/anime', async (req, res) => {
    try {
        const { anime_id, platform_id, url } = req.body;

        if (!anime_id || !platform_id) {
            return res.status(400).json({ error: 'anime_id and platform_id are required' });
        }

        const result = await pool.query(
            `INSERT INTO anime_platforms (anime_id, platform_id, url)
       VALUES ($1, $2, $3)
       ON CONFLICT (anime_id, platform_id) DO UPDATE SET url = EXCLUDED.url
       RETURNING *`,
            [anime_id, platform_id, url]
        );

        res.status(201).json({
            message: 'Platform added to anime',
            anime_platform: result.rows[0]
        });
    } catch (error) {
        console.error('Add anime platform error:', error);
        res.status(500).json({ error: 'Failed to add platform to anime' });
    }
});

export default router;
