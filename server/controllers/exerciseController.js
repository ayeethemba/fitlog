const pool = require('../db');


const getExercises = async (req, res) => {
    try {
    const exercises = await pool.query('SELECT * FROM exercises');
    return res.status(200).json(exercises.rows)
    } catch (error) {
        console.log(error);
    }

}


module.exports = {getExercises};