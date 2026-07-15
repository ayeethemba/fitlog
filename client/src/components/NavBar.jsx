import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png';

function NavBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="bg-gray-950 border-b border-gray-800 px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="logo" className="h-10 w-10" />
                    <span className="text-blue-400 font-bold text-xl tracking-widest uppercase">FitLog</span>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Dashboard</Link>
                    <Link to="/log-workout" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Log Workout</Link>
                    <Link to="/workout-history" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">History</Link>
                    <button onClick={handleLogout} className="bg-blue-400 text-gray-950 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-green-300 transition-colors cursor-pointer">Logout</button>
                </div>

                {/* Hamburger button */}
                <button
                    className="md:hidden text-gray-400 hover:text-white focus:outline-none cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-4 border-t border-gray-800 pt-4">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Dashboard</Link>
                    <Link to="/log-workout" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Log Workout</Link>
                    <Link to="/workout-history" onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">History</Link>
                    <button onClick={handleLogout} className="bg-blue-400 text-gray-950 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-green-300 transition-colors cursor-pointer w-fit">Logout</button>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
