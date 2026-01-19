/**
 * Discussions API Service
 * Handles all discussions/community API calls
 */

import api from './api.js';

/**
 * Get all discussions with optional filters
 */
export async function getDiscussions(params = {}) {
    try {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        const queryString = queryParams.toString();
        const url = `/api/discussions${queryString ? `?${queryString}` : ''}`;

        return await api.get(url);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        throw error;
    }
}

/**
 * Get single discussion by ID
 */
export async function getDiscussion(id) {
    try {
        return await api.get(`/api/discussions/${id}`);
    } catch (error) {
        console.error(`Error fetching discussion ${id}:`, error);
        throw error;
    }
}

/**
 * Create new discussion
 */
export async function createDiscussion(data) {
    try {
        return await api.post('/api/discussions', data);
    } catch (error) {
        console.error('Error creating discussion:', error);
        throw error;
    }
}

/**
 * Update discussion
 */
export async function updateDiscussion(id, data) {
    try {
        return await api.put(`/api/discussions/${id}`, data);
    } catch (error) {
        console.error(`Error updating discussion ${id}:`, error);
        throw error;
    }
}

/**
 * Delete discussion
 */
export async function deleteDiscussion(id) {
    try {
        return await api.delete(`/api/discussions/${id}`);
    } catch (error) {
        console.error(`Error deleting discussion ${id}:`, error);
        throw error;
    }
}

/**
 * Toggle like on discussion
 */
export async function toggleLike(id) {
    try {
        return await api.post(`/api/discussions/${id}/like`);
    } catch (error) {
        console.error(`Error toggling like on discussion ${id}:`, error);
        throw error;
    }
}

/**
 * Get comments for discussion
 */
export async function getComments(discussionId) {
    try {
        return await api.get(`/api/discussions/${discussionId}/comments`);
    } catch (error) {
        console.error(`Error fetching comments for discussion ${discussionId}:`, error);
        throw error;
    }
}

/**
 * Add comment to discussion
 */
export async function addComment(discussionId, content) {
    try {
        return await api.post(`/api/discussions/${discussionId}/comments`, { content });
    } catch (error) {
        console.error(`Error adding comment to discussion ${discussionId}:`, error);
        throw error;
    }
}
