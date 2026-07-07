const pool = require('../db');

const getWorkouts = async (req, res) => {
    const id = req.user.id;
    try {
        const workouts = await pool.query('SELECT w.id, w.date, w.notes, e.name, ws.set_number, ws.reps, ws.weight FROM workouts w JOIN workout_sets ws ON ws.workout_id = w.id JOIN exercises e ON e.id = ws.exercise_id  WHERE w.user_id = $1', [id]);
        res.json(workouts.rows);
    } catch (err) {
        console.log(err);
    }
};

const createWorkout = async (req, res) => {
    const { date, notes, exercises } = req.body;
    const id = req.user.id;


    try {
        const workout = await pool.query('INSERT INTO workouts (user_id, date, notes) VALUES ($1, $2, $3) RETURNING id', [id, date, notes]);
        const wId = workout.rows[0].id;
        for (let i = 0; i < exercises.length; i++) {
            const e = await pool.query('INSERT INTO workout_sets (workout_id, exercise_id, set_number, reps, weight) VALUES ($1, $2, $3, $4, $5)', [wId, exercises[i].exercise_id, exercises[i].sets, exercises[i].reps, exercises[i].weight])
        };
        res.status(201).json({message: 'Workout logged', workoutId: workout.rows[0].id})
    } catch (error) {
        console.log(error);
    }
};


const deleteWorkout = async(req, res) => {
    const id = req.params.id;

    try {
        const workout = await pool.query('DELETE FROM workouts WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (workout.rowCount == 0) {
            res.status(404).json({message: "Workout is N/A or belongs to other user"})
        } else {
        res.status(200).json({message: "Workout deleted"});
        }
    } catch (error) {
        console.log(error)
    }
};




module.exports = { getWorkouts, deleteWorkout, createWorkout };