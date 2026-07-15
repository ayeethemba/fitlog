import api from '../utils/api.js';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import bg from '../assets/landingpage.png';
import Footer from '../components/Footer.jsx';
import { isTokenValid } from '../utils/auth.js';

const inputClass =
    "w-full bg-gray-950/60 border border-gray-800 rounded px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-purple-400 transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-gray-400 mb-1.5";

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (isTokenValid()) {
        return <Navigate to="/dashboard" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/api/auth/register", {
                name: `${firstName.trim()} ${lastName.trim()}`.trim(),
                email,
                password,
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.user.name);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="min-h-screen text-white flex flex-col"
        >
            <div className="min-h-screen flex flex-col bg-gray-950/80">
                <main className="flex-grow flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-md bg-gray-900/90 backdrop-blur border border-gray-800 border-l-4 border-l-purple-400 p-8 sm:p-10">
                        <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">FitLog</p>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Create your account</h1>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                                    <input
                                        className={inputClass}
                                        id="firstName"
                                        value={firstName}
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="Themba"
                                        required
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                                    <input
                                        className={inputClass}
                                        id="lastName"
                                        value={lastName}
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Chika"
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className={labelClass}>Email</label>
                                <input
                                    className={inputClass}
                                    id="email"
                                    type="email"
                                    value={email}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>Password</label>
                                <input
                                    className={inputClass}
                                    id="password"
                                    type="password"
                                    value={password}
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                                <input
                                    className={inputClass}
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    autoComplete="new-password"
                                    placeholder="Re-enter your password"
                                    minLength={8}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-400 text-gray-950 py-2.5 rounded font-bold uppercase tracking-wider hover:bg-blue-300 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Register"}
                            </button>
                        </form>

                        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Already have an account?</p>
                            <Link
                                to="/login"
                                className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider text-sm transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default Signup;
