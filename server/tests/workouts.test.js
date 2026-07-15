process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../db', () => ({
    query: jest.fn(),
    connect: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const app = require('../app');

const token = jwt.sign({ id: 1, name: 'Themba', email: 'a@b.com' }, 'test-secret', { expiresIn: '1h' });
const auth = (req) => req.set('Authorization', `Bearer ${token}`);

beforeEach(() => jest.clearAllMocks());

describe('auth middleware', () => {
    it('rejects requests without a token', async () => {
        const res = await request(app).get('/api/workouts');
        expect(res.status).toBe(401);
    });

    it('rejects an invalid token', async () => {
        const res = await request(app)
            .get('/api/workouts')
            .set('Authorization', 'Bearer garbage');
        expect(res.status).toBe(401);
    });
});

describe('POST /api/workouts', () => {
    it('rejects an empty exercises array', async () => {
        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: '2026-07-14', notes: '', exercises: [] });
        expect(res.status).toBe(400);
        expect(pool.connect).not.toHaveBeenCalled();
    });

    it('rejects a malformed date', async () => {
        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: 'yesterday', exercises: [{ exercise_id: 1, sets: 3, reps: 10, weight: 100 }] });
        expect(res.status).toBe(400);
    });

    it('rejects a far-future date', async () => {
        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: '2099-01-01', exercises: [{ exercise_id: 1, sets: 3, reps: 10, weight: 100 }] });
        expect(res.status).toBe(400);
    });

    it('rejects negative sets', async () => {
        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: '2026-07-14', exercises: [{ exercise_id: 1, sets: -3, reps: 10, weight: 100 }] });
        expect(res.status).toBe(400);
    });

    it('commits the transaction on success', async () => {
        const client = { query: jest.fn(), release: jest.fn() };
        client.query.mockImplementation((sql) => {
            if (typeof sql === 'string' && sql.startsWith('INSERT INTO workouts')) {
                return Promise.resolve({ rows: [{ id: 42 }] });
            }
            return Promise.resolve({ rows: [] });
        });
        pool.connect.mockResolvedValueOnce(client);

        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: '2026-07-14', notes: 'leg day', exercises: [{ exercise_id: 1, sets: 3, reps: 10, weight: 100 }] });

        expect(res.status).toBe(201);
        expect(res.body.workoutId).toBe(42);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(client.release).toHaveBeenCalled();
    });

    it('rolls back the transaction when an insert fails', async () => {
        const client = { query: jest.fn(), release: jest.fn() };
        client.query.mockImplementation((sql) => {
            if (typeof sql === 'string' && sql.startsWith('INSERT INTO workouts')) {
                return Promise.resolve({ rows: [{ id: 42 }] });
            }
            if (typeof sql === 'string' && sql.startsWith('INSERT INTO workout_exercises')) {
                return Promise.reject(new Error('boom'));
            }
            return Promise.resolve({ rows: [] });
        });
        pool.connect.mockResolvedValueOnce(client);

        const res = await auth(request(app).post('/api/workouts'))
            .send({ date: '2026-07-14', exercises: [{ exercise_id: 1, sets: 3, reps: 10, weight: 100 }] });

        expect(res.status).toBe(500);
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });
});

describe('DELETE /api/workouts/:id', () => {
    it('rejects a non-numeric id', async () => {
        const res = await auth(request(app).delete('/api/workouts/abc'));
        expect(res.status).toBe(400);
    });

    it('returns 404 when nothing is deleted', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 });
        const res = await auth(request(app).delete('/api/workouts/7'));
        expect(res.status).toBe(404);
    });

    it('deletes an owned workout', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });
        const res = await auth(request(app).delete('/api/workouts/7'));
        expect(res.status).toBe(200);
        expect(pool.query.mock.calls[0][1]).toEqual([7, 1]);
    });
});
