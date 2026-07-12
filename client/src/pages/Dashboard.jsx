import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import api from '../utils/api.js';

function Dashboard() {
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
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-5xl mx-auto px-8 py-12">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-12">Welcome back {localStorage.getItem("name")}!</p>

                <div className="grid grid-cols-3 gap-6 border-l-4 border-purple-500">
                    <div className="bg-gray-900 border border-gray-800 p-8">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Total Workouts</p>
                        <p className="text-6xl font-black text-white-400">{stats.total_workouts ?? '—'}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 border-l-4 border-l-purple-500" >
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Current Streak</p>
                        <p className="text-6xl font-black text-white-400">{stats.streak ?? '—'}</p>
                        <p className="text-gray-600 text-sm mt-1">days</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 border-l-4 border-l-purple-500" >
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Most Frequent</p>
                        <p className="text-4xl font-black text-white-400 mt-6">{stats.mostFrequent ?? '—'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;