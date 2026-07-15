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
        if (!window.confirm("Delete this workout? This can't be undone.")) return;
        try {
            await api.delete(`/api/workouts/${id}`);
            setWorkoutData(prev => prev.filter(row => row.id !== parseInt(id)));
        } catch (error) {
            console.log(error);
        }
    }

    // Group rows into a Map so the server's date ordering is preserved
    // (a plain object would re-sort integer keys ascending).
    const groupWorkouts = (data) => {
        return data.reduce((acc, row) => {
            if (!acc.has(row.id)) {
                acc.set(row.id, { date: row.date, notes: row.notes, exercises: [] });
            }
            acc.get(row.id).exercises.push({ name: row.name, sets: row.sets, reps: row.reps, weight: row.weight });
            return acc;
        }, new Map());
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-lg mx-auto px-6 sm:px-12 py-12">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white mt-6 mb-6">Your Workout History</h1>

                {workoutData.length === 0 && (
                    <p className="text-gray-500 text-sm uppercase tracking-widest">No workouts logged yet. Go lift something!</p>
                )}

                {[...groupWorkouts(workoutData)].map(([id, workout]) => (
                    <div className="border-l-4 border-l-purple-400 px-4 py-4 mb-6" key={id}>
                        <div className="flex items-center justify-between border-b-2 border-b-blue-400 pb-2 mb-3">
                            <h3 className="text-2xl font-black">{new Date(`${workout.date}T00:00:00`).toLocaleDateString()} {workout.notes}</h3>
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
