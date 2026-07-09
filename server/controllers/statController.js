const pool = require('../db');



const getStats = async (req, res) => {
    const id = req.user.id;
    try {
        const totalWorkouts = await pool.query('SELECT COUNT(*) FROM workouts WHERE user_id = $1', [id]);
        const mostFrequent = await pool.query('SELECT e.name, COUNT(*) AS Frequency FROM workouts w JOIN workout_exercises ws ON w.id = ws.workout_id JOIN exercises e ON ws.exercise_id = e.id WHERE w.user_id = $1 GROUP BY e.name ORDER BY Frequency DESC LIMIT 1', [id]);
        const datesResult = await pool.query(
            'SELECT DISTINCT DATE(date) as date FROM workouts WHERE user_id = $1 ORDER BY date DESC',
            [id]
        );
        const mostFrequentName = mostFrequent.rows.length > 0 ? mostFrequent.rows[0].name : 'N/A';

        const today = new Date().toISOString().split('T')[0];
        let expected = new Date(today);
        let streak = 0;
        const dates = datesResult.rows;
        for (let i = 0; i < dates.length; i++) {
            let curr = new Date(dates[i].date).toISOString().split('T')[0];
            let expectedStr = expected.toISOString().split('T')[0];
            if (curr === expectedStr) {
                streak++;
                expected.setDate(expected.getDate() - 1);
            } else {
                break;
            }
        }
        res.status(200).json({ total_workouts: totalWorkouts.rows[0].count, mostFrequent: mostFrequentName, streak: streak });
    } catch (error) {
        console.log(error);
    }

}

module.exports = {getStats};