import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import api from '../utils/api';

function WorkoutHistory() {
    const [workoutData, setWorkoutData] = useState([]);

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

    async function handleDelete(id) {
        try {
            await api.delete(`/api/workouts/${id}`);
            setWorkoutData(prev => prev.filter(row => row.id !== parseInt(id)));
        } catch (error) {
            console.log(error);
        }
    }

    const groupWorkouts = (data) => {
        return data.reduce((acc, row) => {
            if (!acc[row.id]) {
                acc[row.id] = { date: row.date, notes: row.notes, exercises: [] };
            }
            acc[row.id].exercises.push({ name: row.name, sets: row.sets, reps: row.reps, weight: row.weight });
            return acc;
        }, {});
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-lg mx-auto px-6 sm:px-12 py-12">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white mt-6 mb-6">Your Workout History</h1>

                {Object.entries(groupWorkouts(workoutData)).map(([id, workout]) => (
                    <div className="border-l-4 border-l-purple-400 px-4 py-4 mb-6" key={id}>
                        <div className="flex items-center justify-between border-b-2 border-b-blue-400 pb-2 mb-3">
                            <h3 className="text-2xl font-black">{new Date(workout.date).toLocaleDateString()} {workout.notes}</h3>
                            <button
                                onClick={() => handleDelete(id)}
                                className="text-xs uppercase tracking-wider font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {workout.exercises.map((x, index) => (
                                <li key={index} className="font-black">{x.name} — {x.sets} sets x {x.reps} reps @ {parseFloat(x.weight)}lbs</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    )
}

export default WorkoutHistory;
