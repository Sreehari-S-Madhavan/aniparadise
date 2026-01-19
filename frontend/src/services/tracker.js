/**
 * Tracker API Service
 * Handles all tracker-related API calls (requires authentication)
 */

import api from './api.js';

/**
 * Get user's tracker list
 */
export async function getTracker(status = null) {
  const endpoint = status
    ? `/api/tracker?status=${status}`
    : '/api/tracker';
  return api.get(endpoint);
}

/**
 * Add anime to tracker
 */
export async function addToTracker(animeId, status, progress = 0, rating = null, notes = '') {
  return api.post('/api/tracker', {
    anime_id: animeId,
    status,
    progress,
    rating,
    notes
  });
}

/**
 * Update tracker entry
 */
export async function updateTracker(trackerId, updateData) {
  return api.put(`/api/tracker/${trackerId}`, updateData);
}

/**
 * Remove from tracker
 */
export async function removeFromTracker(trackerId) {
  return api.delete(`/api/tracker/${trackerId}`);
}
