import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import PrivateRoute from "./components/PrivateRoute.jsx"
import LogWorkout  from './pages/LogWorkout.jsx';
import WorkoutHistory from './pages/WorkoutHistory.jsx';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute>
          <Dashboard />
        </PrivateRoute>} />
        <Route path="/log-workout" element={<PrivateRoute>
          <LogWorkout />
        </PrivateRoute>} />
        <Route path="/workout-history" element={<PrivateRoute>
          <WorkoutHistory />
        </PrivateRoute>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
