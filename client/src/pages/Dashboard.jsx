import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import api from '../utils/api.js';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await api.get('/api/stats');
                setStats(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchStats();
    }, [])


    return (
        <div>
            <NavBar />
            <h1>Dashboard</h1>
            <p>Welcome to Fitlog!</p>
            
            
            
            <h2>Your stats: </h2>
            <p>Total Workouts: {stats.total_workouts}</p>
            <p>Current Streak: {stats.streak} Days</p>
            <p>Most Frequent exercise: {stats.mostFrequent}</p>
        </div>
    )
}

export default Dashboard;