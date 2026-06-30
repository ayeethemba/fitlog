require('dotenv').config();
console.log('JWT_SECRET: ', process.env.JWT_SECRET)
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db');


const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;