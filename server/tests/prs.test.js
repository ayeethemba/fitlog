process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Replace the real database module with a fake we control.
jest.mock('../db', () => ({
    query: jest.fn(),
    connect: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const app = require('../app');

// A valid signed token so requests pass the auth middleware.
const token = jwt.sign({ id: 1, name: 'Themba', email: 'a@b.com' }, 'test-secret', { expiresIn: '1h' });
const auth = (req) => req.set('Authorization', `Bearer ${token}`);

beforeEach(() => jest.clearAllMocks());

describe('GET /api/stats/prs', () => {
    it('rejects requests without a token', async () => {
        const res = await request(app).get('/api/stats/prs');
        expect(res.status).toBe(401);
    });

    it('rejects an invalid token', async () => {
        const res = await request(app)
            .get('/api/stats/prs')
            .set('Authorization', 'Bearer garbage');
        expect(res.status).toBe(401);
    });

    it('returns the user PRs on success', async () => {
        const fakePrs = [
            { name: 'Bench Press', weight: '225.00', reps: 5, est_one_rm: '262.5' },
            { name: 'Squat', weight: '315.00', reps: 3, est_one_rm: '346.5' },
        ];
        // Tell the fake DB: next time query() is called, resolve with these rows.
        pool.query.mockResolvedValueOnce({ rows: fakePrs });

        const res = await auth(request(app).get('/api/stats/prs'));

        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakePrs);
        // The controller should have queried scoped to the logged-in user (id 1).
        expect(pool.query.mock.calls[0][1]).toEqual([1]);
    });

    it('returns an empty array when the user has no PRs', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await auth(request(app).get('/api/stats/prs'));

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 500 if the database query fails', async () => {
        pool.query.mockRejectedValueOnce(new Error('db exploded'));

        const res = await auth(request(app).get('/api/stats/prs'));

        expect(res.status).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
