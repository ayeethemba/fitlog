const pool = require('../db');

const getExercises = async (req, res) => {
    try {
        const exercises = await pool.query('SELECT id, name FROM exercises ORDER BY name ASC');
        return res.status(200).json(exercises.rows);
    } catch (error) {
        console.error('getExercises error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getExercises };
