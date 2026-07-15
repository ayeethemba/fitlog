import api from "../utils/api.js";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import bg from '../assets/landingpage.png';
import Footer from "../components/Footer.jsx";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  }


  return (
    <div style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover'}} className="min-h-screen text-white flex flex-col justify-center">
      
      
      <div className="max-w-lg mx-auto px-6 sm:px-12 py-12 border border-blue-400 bg-gray-800">
        <h1 className="text-4xl font-black uppercase tracking-tight pb-4 border-b-3 border-b-purple-400">Welcome to Fitlog!</h1>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-2xl font-black pt-4" onSubmit={handleSubmit}>
          <label htmlFor="email" className="hidden sm:block">Email: </label>
          <input
            className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
            value={email}
            id="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>

          <label htmlFor="password" className="hidden sm:block">Password: </label>
          <input
            className="bg-gray-700 border border-gray-600 px-4 py-2 rounded outline-none w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type='password'
            placeholder="Password"
          ></input>
          {error && <p className="col-span-2 text-red-400 text-sm font-bold">{error}</p>}
          <div className="col-span-2 space-y-3 mt-2">
            <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-blue-400 rounded w-full hover:cursor-pointer hover:border-2 border-gray-50">Login</button>
            <p>Not a user?</p>
            <p>Sign up today!</p>
            <Link className="px-4 py-2 inline-block bg-purple-400 rounded text-gray-950 font-bold hover:cursor-pointer hover:border-gray-50" to='/signup'>Register</Link>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}

export default Login;
