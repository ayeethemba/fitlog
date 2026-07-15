import api from "../utils/api.js";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import bg from '../assets/landingpage.png';
import Footer from "../components/Footer.jsx";
import { isTokenValid } from "../utils/auth.js";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/auth/login", { email, password });
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
      {/* Dark overlay so the card and text stay readable over the image */}
      <div className="min-h-screen flex flex-col bg-gray-950/80">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-gray-900/90 backdrop-blur border border-gray-800 border-l-4 border-l-purple-400 p-8 sm:p-10">
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">FitLog</p>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Welcome back</h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  className="w-full bg-gray-950/60 border border-gray-800 rounded px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-purple-400 transition-colors"
                  value={email}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">
                  Password
                </label>
                <input
                  className="w-full bg-gray-950/60 border border-gray-800 rounded px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-purple-400 transition-colors"
                  value={password}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-400 text-gray-950 py-2.5 rounded font-bold uppercase tracking-wider hover:bg-blue-300 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="border-t border-gray-800 mt-8 pt-6 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Not a user?</p>
              <Link
                to="/signup"
                className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider text-sm transition-colors"
              >
                Sign up today
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Login;
