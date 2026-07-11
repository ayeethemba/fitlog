import { Link, useNavigate } from 'react-router-dom';



function NavBar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav id="nav-buttons">
            <button onClick={handleLogout}>Logout</button>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/log-workout">Log Workout</Link>
            <Link to="/workout-history">Workout History</Link>
        </nav>
    )


}





export default NavBar;