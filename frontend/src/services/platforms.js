/**
 * Platforms API Service
 * Handles fetching streaming platform availability
 */

import api from './api';

/**
 * Get all available platforms
 */
export async function getPlatforms() {
    try {
        const response = await api.get('/api/platforms');
        return response.platforms || [];
    } catch (error) {
        console.error('Error fetching platforms:', error);
        return [];
    }
}

/**
 * Get platforms for a specific anime
 */
export async function getAnimePlatforms(animeId) {
    try {
        const response = await api.get(`/api/platforms/anime/${animeId}`);
        return response.platforms || [];
    } catch (error) {
        console.error('Error fetching anime platforms:', error);
        return [];
    }
}
