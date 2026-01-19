/**
 * Anime API Service
 * Handles all anime-related API calls (Jikan proxy)
 */

import api from './api.js';

/**
 * Retry API call with exponential backoff
 */
async function retryRequest(fn, retries = 2, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.response?.status === 429 || error.response?.status >= 500)) {
      console.log(`Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Search anime
 */
export async function searchAnime(query, page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await retryRequest(() => api.get(`/api/anime?${params}`));

    // Validate response
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

/**
 * Get top/popular anime
 */
export async function getTopAnime(page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await retryRequest(() => api.get(`/api/anime?${params}`));

    // Validate response
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response;
  } catch (error) {
    console.error('Error fetching top anime:', error);
    throw error;
  }
}

/**
 * Get anime by ID
 */
export async function getAnimeById(id) {
  try {
    if (!id) {
      throw new Error('Anime ID is required');
    }

    const response = await retryRequest(() => api.get(`/api/anime/${id}`));

    // Validate response
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response;
  } catch (error) {
    console.error(`Error fetching anime ${id}:`, error);
    throw error;
  }
}

