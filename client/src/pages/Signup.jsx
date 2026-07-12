import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/register", {name: `${firstName} ${lastName}`, email, password});
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.user.name);
            navigate("/dashboard");
        } catch(err) {
            console.log(err)
        }
    
    }
    return (
        <div>
            <h1>Sign up Today!</h1>
            <form onSubmit={handleSubmit}>

            <label htmlFor='firstName'>First Name</label>
            <input 
            id="firstName"
            value={firstName}
            type="text"
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            ></input>

            <label htmlFor="lastName">Last Name</label>
            <input id="lastName"
            value={lastName}
            type="text"
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            ></input>


            <label htmlFor="email">Email: </label>
            <input id="email"
            type='email'
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            ></input>

            <label htmlFor="password">Password: </label>
            <input id="password"
            type='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            ></input>

            <button type="submit">Register</button>
            </form>
        </div>
    )
};

export default Signup;