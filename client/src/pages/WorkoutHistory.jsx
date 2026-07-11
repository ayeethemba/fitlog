import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import api from '../utils/api';

function WorkoutHistory() {
     const [workoutData, setWorkoutData] = useState([])


     useEffect(() => {
        async function populateData() {
            try {
            const data = await api.get('/api/workouts');
            setWorkoutData(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        populateData();

     }, []);

     const groupWorkouts = (data) => {
    return data.reduce((acc, row) => {
        if (!acc[row.id]) {
            acc[row.id] = { date: row.date, notes: row.notes, exercises: [] };
        }
        acc[row.id].exercises.push({ name: row.name, sets: row.set_number, reps: row.reps, weight: row.weight });
        return acc;
    }, {});
}

     return (
        <div>
            <NavBar />
            <h1>Your Workout History</h1>
        
            {Object.entries(groupWorkouts(workoutData)).map(([id, workout]) => (
            <div key={id}>
            <h3>{new Date(workout.date).toLocaleDateString()} {workout.notes} </h3>
            <ul>
                    {workout.exercises.map((x) => (
                        <li>{x.name} — {x.sets} sets x {x.reps} reps @ {parseFloat(x.weight)}lbs</li>
                    ))}
            </ul>
            </div>
))}
           



        </div>


     )


}

export default WorkoutHistory;