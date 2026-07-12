import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import api from '../utils/api';




function LogWorkout() {

    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [selection, setSelection] = useState({ exercise_id: "", sets: "", reps: "", weight: "", });
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    useEffect(() => {
        async function fetchExercises() {
            try {
                const e = await api.get('/api/exercises');
                setExerciseList(e.data);
                setSelection(prev => ({ ...prev, exercise_id: e.data[0].id }));
            } catch (error) {
                console.log(error)
            }
        }
        fetchExercises();
    }, []);

    function handleAdd() {
        console.log(selection);
        if (selection.reps && selection.exercise_id && selection.sets && selection.weight) {
            setExercises([...exercises, selection]);
        }
        else {
            alert("Select Fields Before adding")
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const today = new Date().toLocaleDateString('en-CA');
        if (date > today) {
            alert("You can't log a workout in the future");
            return;
        }
        try {
            const response = await api.post('/api/workouts', { date, notes: note, exercises });

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />



            <div className="max-w-lg mx-auto px-12 py-12">
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

                    <div className="flex gap-4 mt-2">
                        <button className="bg-blue-400 text-gray-950 px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-blue-300 cursor-pointer transition-colors" type="button" onClick={handleAdd}>Add Exercise</button>
                        <button className="bg-purple-400 text-gray-950 px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-purple-300 cursor-pointer transition-colors" type="submit">Submit</button>
                    </div>

                </form>
            </div>
        </div>


    )


}

export default LogWorkout;