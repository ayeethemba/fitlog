import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
console.log(logo);


function NavBar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-950 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
            <span className="text-blue-400 font-bold text-xl tracking-widest uppercase">FitLog</span>
            <div className="flex items-center gap-8">
                <img src={logo} alt="logo" className="h-16 w-16"/>
                <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Dashboard</Link>
                <Link to="/log-workout" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">Log Workout</Link>
                <Link to="/workout-history" className="text-gray-400 hover:text-white text-sm uppercase tracking-wider transition-colors">History</Link>
                <button onClick={handleLogout} className="bg-blue-400 text-gray-950 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-green-300 transition-colors cursor-pointer">Logout</button>
                
            </div>
        </nav>
    )


}





export default NavBar;