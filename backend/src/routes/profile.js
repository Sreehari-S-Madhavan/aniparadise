/**
 * Profile Routes
 * GET /api/profile - Get current user's profile
 * PUT /api/profile - Update current user's profile
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

/**
 * Get current user's profile with statistics
 * GET /api/profile
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user basic info
    const userResult = await pool.query(
      `SELECT 
        id, username, email, display_name, bio, avatar_url, 
        favorite_genres, location, website, birth_date, 
        created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch tracker statistics
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_anime,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'watching') as watching,
        COUNT(*) FILTER (WHERE status = 'on-hold') as on_hold,
        COUNT(*) FILTER (WHERE status = 'dropped') as dropped,
        COUNT(*) FILTER (WHERE status = 'plan-to-watch') as plan_to_watch,
        AVG(rating) FILTER (WHERE rating IS NOT NULL) as mean_score
       FROM tracker
       WHERE user_id = $1`,
      [userId]
    );

    const stats = {
      total_anime: parseInt(statsResult.rows[0].total_anime) || 0,
      completed: parseInt(statsResult.rows[0].completed) || 0,
      watching: parseInt(statsResult.rows[0].watching) || 0,
      on_hold: parseInt(statsResult.rows[0].on_hold) || 0,
      dropped: parseInt(statsResult.rows[0].dropped) || 0,
      plan_to_watch: parseInt(statsResult.rows[0].plan_to_watch) || 0,
      mean_score: parseFloat(statsResult.rows[0].mean_score || 0).toFixed(1)
    };

    // Return profile with stats
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.display_name || user.username,
        bio: user.bio,
        avatar_url: user.avatar_url,
        favorite_genres: user.favorite_genres || [],
        location: user.location,
        website: user.website,
        birth_date: user.birth_date,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      stats
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * Update current user's profile
 * PUT /api/profile
 * Body: { display_name, bio, avatar_url, favorite_genres, location, website, birth_date, password (optional) }
 */
router.put('/', async (req, res) => {
  try {
    const userId = req.userId;
    const {
      display_name,
      bio,
      avatar_url,
      favorite_genres,
      location,
      website,
      birth_date,
      password,
      current_password
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (display_name !== undefined) {
      updates.push(`display_name = $${paramCount++}`);
      values.push(display_name);
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }

    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount++}`);
      values.push(avatar_url);
    }

    if (favorite_genres !== undefined) {
      // Validate it's an array
      if (Array.isArray(favorite_genres)) {
        updates.push(`favorite_genres = $${paramCount++}::jsonb`);
        values.push(JSON.stringify(favorite_genres));
      } else {
        return res.status(400).json({ error: 'favorite_genres must be an array' });
      }
    }

    if (location !== undefined) {
      updates.push(`location = $${paramCount++}`);
      values.push(location);
    }

    if (website !== undefined) {
      updates.push(`website = $${paramCount++}`);
      values.push(website);
    }

    if (birth_date !== undefined) {
      updates.push(`birth_date = $${paramCount++}`);
      values.push(birth_date);
    }

    // Handle password change
    if (password) {
      if (!current_password) {
        return res.status(400).json({ error: 'current_password is required to change password' });
      }

      // Get current password hash
      const userResult = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        current_password,
        userResult.rows[0].password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updated_at and user_id
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, username, email, display_name, bio, avatar_url, 
                favorite_genres, location, website, birth_date, 
                created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Profile updated successfully',
      profile: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        display_name: result.rows[0].display_name || result.rows[0].username,
        bio: result.rows[0].bio,
        avatar_url: result.rows[0].avatar_url,
        favorite_genres: result.rows[0].favorite_genres || [],
        location: result.rows[0].location,
        website: result.rows[0].website,
        birth_date: result.rows[0].birth_date,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
