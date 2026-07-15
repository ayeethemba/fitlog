import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from '../utils/api';




function LogWorkout() {

    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [selection, setSelection] = useState({ exercise_id: "", sets: "", reps: "", weight: "", });
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        async function fetchExercises() {
            try {
                const e = await api.get('/api/exercises');
                setExerciseList(e.data);
                if (e.data.length > 0) {
                    setSelection(prev => ({ ...prev, exercise_id: e.data[0].id }));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchExercises();
    }, []);

    function handleAdd() {
        if (selection.reps && selection.exercise_id && selection.sets && selection.weight) {
            setExercises([...exercises, selection]);
            setSelection(prev => ({ ...prev, sets: "", reps: "", weight: "" }));
            setError("");
        } else {
            setError("Fill in all fields before adding an exercise.");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const today = new Date().toLocaleDateString('en-CA');
        if (date > today) {
            setError("You can't log a workout in the future.");
            return;
        }
        if (!date) {
            setError("Please select a date.");
            return;
        }
        if (exercises.length === 0) {
            setError("Add at least one exercise before submitting.");
            return;
        }
        try {
            await api.post('/api/workouts', { date, notes: note, exercises });
            setSuccess(true);
            setError("");
            setDate("");
            setNote("");
            setExercises([]);
            setSelection(prev => ({ ...prev, sets: "", reps: "", weight: "" }));
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />



            <div className="max-w-lg mx-auto px-6 sm:px-12 py-12">
                <div id="log-workout">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-white mt-6 mb-6">Log a Workout!</h2>
                </div>
                <form className="border-l-4 border-l-purple-400 py-2 space-y-4 px-2" onSubmit={handleSubmit}>
                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black flex items-center gap-2">
                        <label htmlFor="date">Date: </label>
                        <input className="cursor-pointer bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="date" type='date' placeholder="Date"
                            value={date} onChange={(e) => setDate(e.target.value)}></input>
                    </div>

                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black flex items-center gap-2">
                        <label htmlFor="notes">Notes: </label>
                        <input className="bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="notes" type="text" placeholder="Notes"
                            value={note} onChange={(e) => setNote(e.target.value)}></input>
                    </div>
                    {/* Exercise Dropdown */}

                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black flex items-center gap-2">
                        <label htmlFor="exercises">Select Exercise: </label>
                        <select className="cursor-pointer bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="exercises" name="exercises" value={selection.exercise_id}
                            onChange={(e) => setSelection({ ...selection, exercise_id: e.target.value })}>
                            {exerciseList.map((exercise) => (
                                <option className="bg-gray-800" key={exercise.id} value={exercise.id}>
                                    {exercise.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black">
                        <input className="bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="sets" placeholder="Sets" type='number'
                            value={selection.sets} onChange={(e) => setSelection({ ...selection, sets: e.target.value })}></input>
                    </div>
                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black">
                        <input className="bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="reps" placeholder="Reps" type="number"
                            value={selection.reps} onChange={(e) => setSelection({ ...selection, reps: e.target.value })}></input>
                    </div>

                    <div className="bg-gray-800 w-full border border-gray-700 text-white px-4 py-2 rounded font-black">
                        <input className="bg-transparent outline-none focus:ring-2 focus:ring-purple-500 w-full" id="weight" placeholder="Weight" type="number"
                            value={selection.weight} onChange={(e) => setSelection({ ...selection, weight: e.target.value })}></input>
                    </div>

                    {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

                    <div className="flex gap-4 mt-2">
                        <button className="bg-blue-400 text-gray-950 px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-blue-300 cursor-pointer transition-colors" type="button" onClick={handleAdd}>Add Exercise</button>
                        <button className="bg-purple-400 text-gray-950 px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-purple-300 cursor-pointer transition-colors" type="submit">Log Workout</button>
                    </div>

                </form>

                {exercises.length > 0 && (
                    <div className="mt-8 border-l-4 border-l-blue-400 px-4 py-4">
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 font-black mb-4">Exercises Queued</h3>
                        <ul className="space-y-2">
                            {exercises.map((ex, i) => {
                                const name = exerciseList.find(e => e.id == ex.exercise_id)?.name || "Unknown";
                                return (
                                    <li key={i} className="font-black text-white">
                                        {name} — {ex.sets} sets x {ex.reps} reps @ {ex.weight}lbs
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {success && (
                    <div className="mt-6 bg-green-400 text-gray-950 px-6 py-4 font-black uppercase tracking-wider">
                        Workout logged successfully!
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default LogWorkout;