import { useState, useEffect } from "react";
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
        <div>
            <h2>Log a Workout!</h2>
            <form onSubmit={handleSubmit}>

                <label htmlFor="date">Date: </label>
                <input id="date" type='date' placeholder="Date"
                    value={date} onChange={(e) => setDate(e.target.value)}></input>


                <label htmlFor="notes">Notes: </label>
                <input id="notes" type="text" placeholder="Notes"
                    value={note} onChange={(e) => setNote(e.target.value)}></input>

                {/* Exercise Dropdown */}

                <label htmlFor="exercises">Select Exercise: </label>
                <select id="exercises" name="exercises" value={selection.exercise_id}
                    onChange={(e) => setSelection({ ...selection, exercise_id: e.target.value })}>
                    {exerciseList.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>


                <input id="sets" placeholder="Sets" type='number'
                    value={selection.sets} onChange={(e) => setSelection({ ...selection, sets: e.target.value })}></input>

                <input id="reps" placeholder="Reps" type="number"
                    value={selection.reps} onChange={(e) => setSelection({ ...selection, reps: e.target.value })}></input>


                <input id="weight" placeholder="Weight" type="number"
                    value={selection.weight} onChange={(e) => setSelection({ ...selection, weight: e.target.value })}></input>





                <button type="button" onClick={handleAdd}>Add Exercise</button>
                <button type="submit">Submit</button>
            </form>

        </div>
    )


}

export default LogWorkout;