const pool = require('../db');

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Shift a YYYY-MM-DD string by n days, doing all math in UTC so no
// server-timezone conversion can move the date.
const shiftDate = (dateStr, days) => {
    const d = new Date(`${dateStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
};

// Count consecutive workout days. The streak is alive if the most recent
// workout was today OR yesterday (missing today doesn't zero you out at 9am).
const computeStreak = (dateStrings, today) => {
    if (dateStrings.length === 0) return 0;

    let expected;
    if (dateStrings[0] === today) {
        expected = today;
    } else if (dateStrings[0] === shiftDate(today, -1)) {
        expected = dateStrings[0];
    } else {
        return 0;
    }

    let streak = 0;
    for (const date of dateStrings) {
        if (date === expected) {
            streak++;
            expected = shiftDate(expected, -1);
        } else {
            break;
        }
    }
    return streak;
};

const getStats = async (req, res) => {
    const id = req.user.id;

    // The client sends its local date so "today" reflects the user's timezone,
    // not the server's. Fall back to UTC if absent/malformed.
    const clientToday = typeof req.query.today === 'string' && DATE_REGEX.test(req.query.today)
        ? req.query.today
        : new Date().toISOString().split('T')[0];

    try {
        const [totalWorkouts, mostFrequent, datesResult] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM workouts WHERE user_id = $1', [id]),
            pool.query(
                `SELECT e.name, COUNT(*) AS frequency
                 FROM workouts w
                 JOIN workout_exercises ws ON w.id = ws.workout_id
                 JOIN exercises e ON ws.exercise_id = e.id
                 WHERE w.user_id = $1
                 GROUP BY e.name
                 ORDER BY frequency DESC
                 LIMIT 1`,
                [id]
            ),
            // to_char keeps dates as plain strings; no Date objects, no timezone drift
            pool.query(
                `SELECT DISTINCT to_char(date, 'YYYY-MM-DD') AS date
                 FROM workouts
                 WHERE user_id = $1
                 ORDER BY date DESC`,
                [id]
            ),
        ]);

        const streak = computeStreak(datesResult.rows.map((r) => r.date), clientToday);

        res.status(200).json({
            total_workouts: parseInt(totalWorkouts.rows[0].count, 10),
            mostFrequent: mostFrequent.rows[0]?.name ?? 'N/A',
            streak,
        });
    } catch (error) {
        console.error('getStats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getStats, computeStreak };
