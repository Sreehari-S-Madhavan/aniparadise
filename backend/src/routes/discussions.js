/**
 * Discussions Routes
 * API endpoints for community discussions/posts
 */

import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/discussions
 * Get all discussions with filters
 * Query params: ?category=anime&sort=latest&limit=20
 */
router.get('/', async (req, res) => {
    try {
        const { category, sort = 'latest', limit = 20, offset = 0 } = req.query;

        let query = `
      SELECT 
        d.id, d.title, d.content, d.category, d.anime_id, d.image_url,
        d.likes_count, d.comments_count, d.created_at,
        u.id as user_id, u.username, u.display_name, u.avatar_url
      FROM discussions d
      JOIN users u ON d.user_id = u.id
    `;

        const params = [];
        const conditions = [];

        if (category && category !== 'all') {
            conditions.push(`d.category = $${params.length + 1}`);
            params.push(category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Sorting
        if (sort === 'hot') {
            query += ' ORDER BY (d.likes_count + d.comments_count * 2) DESC, d.created_at DESC';
        } else {
            query += ' ORDER BY d.created_at DESC';
        }

        params.push(limit, offset);
        query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const result = await pool.query(query, params);

        res.json({
            discussions: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Failed to fetch discussions' });
    }
});

/**
 * GET /api/discussions/:id
 * Get single discussion by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
      SELECT 
        d.id, d.title, d.content, d.category, d.anime_id, d.image_url,
        d.likes_count, d.comments_count, d.created_at, d.updated_at,
        u.id as user_id, u.username, u.display_name, u.avatar_url
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({ error: 'Failed to fetch discussion' });
    }
});

/**
 * POST /api/discussions
 * Create new discussion (requires authentication)
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, content, category = 'general', anime_id, image_url } = req.body;
        const userId = req.userId;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await pool.query(`
      INSERT INTO discussions (user_id, title, content, category, anime_id, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, content, category, anime_id, image_url, likes_count, comments_count, created_at
    `, [userId, title, content, category, anime_id, image_url]);

        res.status(201).json({
            message: 'Discussion created successfully',
            discussion: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Failed to create discussion' });
    }
});

/**
 * PUT /api/discussions/:id
 * Update discussion (requires authentication and ownership)
 */
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        const userId = req.userId;

        // Check ownership
        const checkResult = await pool.query(
            'SELECT user_id FROM discussions WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'You can only edit your own discussions' });
        }

        const result = await pool.query(`
      UPDATE discussions
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          category = COALESCE($3, category),
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [title, content, category, id]);

        res.json({
            message: 'Discussion updated successfully',
            discussion: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating discussion:', error);
        res.status(500).json({ error: 'Failed to update discussion' });
    }
});

/**
 * DELETE /api/discussions/:id
 * Delete discussion (requires authentication and ownership)
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check ownership
        const checkResult = await pool.query(
            'SELECT user_id FROM discussions WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'You can only delete your own discussions' });
        }

        await pool.query('DELETE FROM discussions WHERE id = $1', [id]);

        res.json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({ error: 'Failed to delete discussion' });
    }
});

/**
 * POST /api/discussions/:id/like
 * Like/unlike a discussion (toggle)
 */
router.post('/:id/like', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check if already liked
        const existingLike = await pool.query(
            'SELECT id FROM discussion_likes WHERE discussion_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (existingLike.rows.length > 0) {
            // Unlike
            await pool.query(
                'DELETE FROM discussion_likes WHERE discussion_id = $1 AND user_id = $2',
                [id, userId]
            );

            res.json({ message: 'Discussion unliked', liked: false });
        } else {
            // Like
            await pool.query(
                'INSERT INTO discussion_likes (discussion_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );

            res.json({ message: 'Discussion liked', liked: true });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

/**
 * GET /api/discussions/:id/comments
 * Get all comments for a discussion
 */
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
      SELECT 
        dc.id, dc.content, dc.created_at,
        u.id as user_id, u.username, u.display_name, u.avatar_url
      FROM discussion_comments dc
      JOIN users u ON dc.user_id = u.id
      WHERE dc.discussion_id = $1
      ORDER BY dc.created_at ASC
    `, [id]);

        res.json({ comments: result.rows });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

/**
 * POST /api/discussions/:id/comments
 * Add a comment to a discussion
 */
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const result = await pool.query(`
      INSERT INTO discussion_comments (discussion_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, content, created_at
    `, [id, userId, content]);

        res.status(201).json({
            message: 'Comment added successfully',
            comment: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

export default router;
