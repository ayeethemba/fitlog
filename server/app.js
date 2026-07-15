require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Security middleware ---
app.use(helmet());

// Only allow the deployed frontend + local dev, not every origin on the internet
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// Throttle auth attempts to slow down credential brute-forcing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts, please try again later' },
});

// --- Core middleware ---
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json({ limit: '10kb' }));

// --- Routes ---
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/stats', require('./routes/statRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler (malformed JSON, uncaught route errors) ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Server error' });
});

module.exports = app;
