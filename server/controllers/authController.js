const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isNonEmptyString, isValidEmail, isValidPassword } = require('../utils/validate');

const SALT_ROUNDS = 10;
const TOKEN_TTL = '7d';

const signToken = (user) =>
    jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_TTL }
    );

const register = async (req, res) => {
    const { name, email, password } = req.body ?? {};

    if (!isNonEmptyString(name) || name.trim().length > 100) {
        return res.status(400).json({ error: 'Name is required (max 100 characters)' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be 8-72 characters' });
    }

    try {
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name.trim(), email.trim().toLowerCase(), password_hash]
        );
        const user = newUser.rows[0];

        return res.status(201).json({ user, token: signToken(user) });
    } catch (error) {
        // 23505 = unique_violation on users.email (atomic duplicate check, no race condition)
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        console.error('register error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!isValidEmail(email) || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, email, password_hash FROM users WHERE email = $1',
            [email.trim().toLowerCase()]
        );
        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email },
            token: signToken(user),
        });
    } catch (error) {
        console.error('login error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { register, login };
