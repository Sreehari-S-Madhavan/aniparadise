/**
 * AniParadise Backend Server
 * Express.js server with PostgreSQL and JWT authentication
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import animeRoutes from './routes/anime.js';
import trackerRoutes from './routes/tracker.js';
import profileRoutes from './routes/profile.js';
import discussionsRoutes from './routes/discussions.js';
import platformsRoutes from './routes/platforms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AniParadise API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discussions', discussionsRoutes);
app.use('/api/platforms', platformsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AniParadise API server running on port ${PORT}`);
});

export default app;
