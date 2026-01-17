const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { helmetMiddleware, generalLimiter } = require('./middleware/security');

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(generalLimiter);

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? corsOrigin // Must be set in production
    : corsOrigin || true, // Allow all in development if not set
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

if (process.env.NODE_ENV === 'production' && !corsOrigin) {
  console.warn('WARNING: CORS_ORIGIN not set in production. CORS will block all cross-origin requests.');
}

app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
