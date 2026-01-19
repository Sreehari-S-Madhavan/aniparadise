/**
 * Tracker Routes
 * GET /api/tracker - Get user's tracker list
 * POST /api/tracker - Add anime to tracker
 * PUT /api/tracker/:id - Update tracker entry
 * DELETE /api/tracker/:id - Remove from tracker
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// All tracker routes require authentication
router.use(authenticate);

/**
 * Get user's tracker list
 * GET /api/tracker?status=watching
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.userId;

    let query = `
      SELECT t.*, t.id as tracker_id
      FROM tracker t
      WHERE t.user_id = $1
    `;
    const params = [userId];

    if (status) {
      query += ' AND t.status = $2';
      params.push(status);
    }

    query += ' ORDER BY t.updated_at DESC';

    const result = await pool.query(query, params);
    res.json({ tracker: result.rows });
  } catch (error) {
    console.error('Get tracker error:', error);
    res.status(500).json({ error: 'Failed to fetch tracker' });
  }
});

/**
 * Add anime to tracker
 * POST /api/tracker
 * Body: { anime_id, status, progress, rating, notes }
 */
router.post('/', async (req, res) => {
  try {
    const { anime_id, status, progress = 0, rating = null, notes = '' } = req.body;
    const userId = req.userId;

    // Validation
    if (!anime_id || !status) {
      return res.status(400).json({ error: 'anime_id and status are required' });
    }

    const validStatuses = ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if already exists
    const existing = await pool.query(
      'SELECT id FROM tracker WHERE user_id = $1 AND anime_id = $2',
      [userId, anime_id]
    );

    if (existing.rows.length > 0) {
      // Update existing
      const result = await pool.query(
        `UPDATE tracker 
         SET status = $1, progress = COALESCE($2, progress), rating = COALESCE($3, rating), notes = COALESCE($4, notes), updated_at = NOW()
         WHERE user_id = $5 AND anime_id = $6
         RETURNING *`,
        [status, progress, rating, notes, userId, anime_id]
      );
      return res.json({ message: 'Tracker updated', tracker: result.rows[0] });
    }

    // Create new
    const result = await pool.query(
      `INSERT INTO tracker (user_id, anime_id, status, progress, rating, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, anime_id, status, progress, rating, notes]
    );

    res.status(201).json({
      message: 'Anime added to tracker',
      tracker: result.rows[0]
    });
  } catch (error) {
    console.error('Add tracker error:', error);
    res.status(500).json({ error: 'Failed to add to tracker' });
  }
});

/**
 * Update tracker entry
 * PUT /api/tracker/:id
 * Body: { status, progress, rating, notes }
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, rating, notes } = req.body;
    const userId = req.userId;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      const validStatuses = ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (progress !== undefined) {
      updates.push(`progress = $${paramCount++}`);
      values.push(parseInt(progress) || 0);
    }

    if (rating !== undefined) {
      updates.push(`rating = $${paramCount++}`);
      values.push(rating === null ? null : parseInt(rating));
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updated_at and user_id
    values.push(id);
    values.push(userId);

    const query = `
      UPDATE tracker 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tracker entry not found' });
    }

    res.json({ message: 'Tracker updated', tracker: result.rows[0] });
  } catch (error) {
    console.error('Update tracker error:', error);
    res.status(500).json({ error: 'Failed to update tracker' });
  }
});

/**
 * Delete tracker entry
 * DELETE /api/tracker/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      'DELETE FROM tracker WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tracker entry not found' });
    }

    res.json({ message: 'Removed from tracker' });
  } catch (error) {
    console.error('Delete tracker error:', error);
    res.status(500).json({ error: 'Failed to remove from tracker' });
  }
});

export default router;
