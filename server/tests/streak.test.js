process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../db', () => ({
    query: jest.fn(),
    connect: jest.fn(),
}));

const { computeStreak } = require('../controllers/statController');

describe('computeStreak', () => {
    const today = '2026-07-15';

    it('returns 0 with no workouts', () => {
        expect(computeStreak([], today)).toBe(0);
    });

    it('counts a streak ending today', () => {
        expect(computeStreak(['2026-07-15', '2026-07-14', '2026-07-13'], today)).toBe(3);
    });

    it('keeps the streak alive if the last workout was yesterday', () => {
        expect(computeStreak(['2026-07-14', '2026-07-13'], today)).toBe(2);
    });

    it('returns 0 if the last workout was two days ago', () => {
        expect(computeStreak(['2026-07-13', '2026-07-12'], today)).toBe(0);
    });

    it('stops counting at a gap', () => {
        expect(computeStreak(['2026-07-15', '2026-07-14', '2026-07-11'], today)).toBe(2);
    });

    it('handles month boundaries', () => {
        expect(computeStreak(['2026-07-01', '2026-06-30', '2026-06-29'], '2026-07-01')).toBe(3);
    });
});
