import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import api from '../utils/api.js';

function Dashboard() {
    const [stats, setStats] = useState({});
    const [prs, setPrs] = useState([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await api.get('/api/stats', {
                    params: { today: new Date().toLocaleDateString('en-CA') }
                });
                setStats(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchStats();
    }, [])

    useEffect(() => {
        async function fetchPrs() {
            try {
                const data = await api.get('/api/stats/prs');
                setPrs(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchPrs();

    }, [])


    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-5xl mx-auto px-8 py-12">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-12">Welcome back {localStorage.getItem("name")}!</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-900 border border-gray-800 p-8 border-l-4 border-l-purple-500">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Total Workouts</p>
                        <p className="text-6xl font-black text-white">{stats.total_workouts ?? '—'}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 border-l-4 border-l-purple-500" >
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Current Streak 🔥</p>
                        <p className="text-6xl font-black text-white">{stats.streak ?? '—'}</p>
                        <p className="text-gray-600 text-sm mt-1">days</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 border-l-4 border-l-purple-500" >
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Most Frequent</p>
                        <p className="text-4xl font-black text-white mt-6">{stats.mostFrequent ?? '—'}</p>
                    </div>
                </div>
                {/* below the stats grid, inside the max-w-5xl div */}
                <div className="mt-12">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 font-black mb-4">Personal Records</h2>

                    {prs.length === 0 && (
                        <p className="text-gray-600 text-sm">No PRs yet. Log some workouts!</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prs.map((pr) => (
                            <div key={pr.name} className="bg-gray-900 border border-gray-800 border-l-4 border-l-blue-400 p-6">
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{pr.name}</p>
                                <p className="text-4xl font-black text-white">
                                    {Math.round(pr.est_one_rm)}
                                    <span className="text-lg text-gray-500 font-bold"> lbs 1RM</span>
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    {parseFloat(pr.weight)} lbs × {pr.reps} reps
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard;