/**
 * Profile API Service
 * Handles all profile-related API calls (requires authentication)
 */

import api from './api.js';

/**
 * Get current user's profile
 */
export async function getProfile() {
  return api.get('/api/profile');
}

/**
 * Update current user's profile
 */
export async function updateProfile(profileData) {
  return api.put('/api/profile', profileData);
}

/**
 * Update password
 */
export async function updatePassword(currentPassword, newPassword) {
  return api.put('/api/profile', {
    password: newPassword,
    current_password: currentPassword
  });
}
