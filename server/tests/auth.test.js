process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../db', () => ({
    query: jest.fn(),
    connect: jest.fn(),
}));

const request = require('supertest');
const bcrypt = require('bcrypt');
const pool = require('../db');
const app = require('../app');

beforeEach(() => jest.clearAllMocks());

describe('POST /api/auth/register', () => {
    it('rejects a missing name', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'a@b.com', password: 'password123' });
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it('rejects an invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Themba', email: 'not-an-email', password: 'password123' });
        expect(res.status).toBe(400);
    });

    it('rejects a short password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Themba', email: 'a@b.com', password: 'short' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/8/);
    });

    it('creates a user and returns a token', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, name: 'Themba', email: 'a@b.com' }],
            rowCount: 1,
        });
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Themba', email: 'A@B.com', password: 'password123' });
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('a@b.com');
        // email should be normalized to lowercase before insert
        expect(pool.query.mock.calls[0][1][1]).toBe('a@b.com');
    });

    it('maps a unique violation to "Email already in use"', async () => {
        pool.query.mockRejectedValueOnce(Object.assign(new Error('dup'), { code: '23505' }));
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Themba', email: 'a@b.com', password: 'password123' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email already in use');
    });

    it('does not leak internal error details', async () => {
        pool.query.mockRejectedValueOnce(new Error('relation "users" does not exist'));
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Themba', email: 'a@b.com', password: 'password123' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Server error');
    });
});

describe('POST /api/auth/login', () => {
    it('returns 400 for an unknown email', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@b.com', password: 'password123' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid email or password');
    });

    it('returns 400 for a wrong password', async () => {
        const password_hash = await bcrypt.hash('correct-password', 4);
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, name: 'Themba', email: 'a@b.com', password_hash }],
            rowCount: 1,
        });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'a@b.com', password: 'wrong-password' });
        expect(res.status).toBe(400);
    });

    it('returns a token and user on success', async () => {
        const password_hash = await bcrypt.hash('correct-password', 4);
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, name: 'Themba', email: 'a@b.com', password_hash }],
            rowCount: 1,
        });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'a@b.com', password: 'correct-password' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toEqual({ id: 1, name: 'Themba', email: 'a@b.com' });
        expect(res.body.user.password_hash).toBeUndefined();
    });
});
