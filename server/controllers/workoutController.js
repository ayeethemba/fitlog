const pool = require('../db');
const { isValidDateString, isPositiveInt, isNonNegativeNumber } = require('../utils/validate');

const getWorkouts = async (req, res) => {
    try {
        const workouts = await pool.query(
            `SELECT w.id, to_char(w.date, 'YYYY-MM-DD') AS date, w.notes, e.name, ws.sets, ws.reps, ws.weight
             FROM workouts w
             JOIN workout_exercises ws ON ws.workout_id = w.id
             JOIN exercises e ON e.id = ws.exercise_id
             WHERE w.user_id = $1
             ORDER BY w.date DESC, w.id DESC, ws.id ASC`,
            [req.user.id]
        );
        res.json(workouts.rows);
    } catch (err) {
        console.error('getWorkouts error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const validateWorkoutBody = ({ date, notes, exercises }) => {
    if (!isValidDateString(date)) return 'A valid date (YYYY-MM-DD) is required';

    // Compare against UTC today +1 day of tolerance so users ahead of UTC aren't blocked
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (date > tomorrow) return "You can't log a workout in the future";

    if (notes != null && (typeof notes !== 'string' || notes.length > 500)) {
        return 'Notes must be a string of at most 500 characters';
    }
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return 'At least one exercise is required';
    }
    if (exercises.length > 50) return 'Too many exercises in one workout';

    for (const ex of exercises) {
        if (!isPositiveInt(ex?.exercise_id, 100000)) return 'Invalid exercise selected';
        if (!isPositiveInt(ex?.sets, 100)) return 'Sets must be a whole number between 1 and 100';
        if (!isPositiveInt(ex?.reps, 1000)) return 'Reps must be a whole number between 1 and 1000';
        if (!isNonNegativeNumber(ex?.weight, 5000)) return 'Weight must be a number between 0 and 5000';
    }
    return null;
};

const createWorkout = async (req, res) => {
    const { date, notes, exercises } = req.body ?? {};

    const validationError = validateWorkoutBody({ date, notes, exercises });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Run the whole insert in a transaction: either the workout and ALL of its
    // exercises are saved, or nothing is (no orphaned half-workouts).
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const workout = await client.query(
            'INSERT INTO workouts (user_id, date, notes) VALUES ($1, $2, $3) RETURNING id',
            [req.user.id, date, notes ?? null]
        );
        const workoutId = workout.rows[0].id;

        for (const ex of exercises) {
            await client.query(
                'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight) VALUES ($1, $2, $3, $4, $5)',
                [workoutId, ex.exercise_id, ex.sets, ex.reps, ex.weight]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Workout logged', workoutId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('createWorkout error:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
};

const deleteWorkout = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid workout id' });
    }

    try {
        const workout = await pool.query(
            'DELETE FROM workouts WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        if (workout.rowCount === 0) {
            res.status(404).json({ error: 'Workout not found' });
        } else {
            res.status(200).json({ message: 'Workout deleted' });
        }
    } catch (error) {
        console.error('deleteWorkout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getWorkouts, deleteWorkout, createWorkout };
