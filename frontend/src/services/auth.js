/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import api from './api.js';

/**
 * Register new user
 */
export async function register(username, email, password) {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password
  });
  
  // Store token
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  
  return response;
}

/**
 * Login user
 */
export async function login(email, password) {
  const response = await api.post('/api/auth/login', {
    email,
    password
  });
  
  // Store token
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  
  return response;
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get token from localStorage
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}
