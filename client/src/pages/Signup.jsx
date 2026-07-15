import api from '../utils/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import bg from '../assets/landingpage.png';
import Footer from '../components/Footer.jsx';

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/register", { name: `${firstName} ${lastName}`, email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.user.name);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        }
    }

    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }} className="min-h-screen text-white flex flex-col justify-center">
            <div className="max-w-lg mx-auto px-6 sm:px-12 py-12 border border-blue-400 bg-gray-800">
                <h1 className="text-4xl font-black uppercase tracking-tight pb-4 border-b-3 border-b-purple-400">Sign Up Today!</h1>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-2xl font-black pt-4" onSubmit={handleSubmit}>

                    <label htmlFor="firstName" className="hidden sm:block">First Name:</label>
                    <input
                        className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
                        id="firstName"
                        value={firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <label htmlFor="lastName" className="hidden sm:block">Last Name:</label>
                    <input
                        className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
                        id="lastName"
                        value={lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <label htmlFor="email" className="hidden sm:block">Email:</label>
                    <input
                        className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password" className="hidden sm:block">Password:</label>
                    <input
                        className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="col-span-2 text-red-400 text-sm font-bold">{error}</p>}
                    <div className="col-span-2 space-y-3 mt-2">
                        <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-blue-400 rounded w-full hover:cursor-pointer hover:border-2 border-gray-50">Register</button>
                        <p>Already have an account?</p>
                        <Link className="px-4 py-2 inline-block bg-purple-400 rounded text-gray-950 font-bold" to="/login">Login</Link>
                    </div>

                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Signup;
