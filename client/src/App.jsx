import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import LogWorkout from './pages/LogWorkout.jsx';
import WorkoutHistory from './pages/WorkoutHistory.jsx';
import NotFound from './pages/NotFound.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isTokenValid } from './utils/auth.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isTokenValid() ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/log-workout" element={<PrivateRoute><LogWorkout /></PrivateRoute>} />
        <Route path="/workout-history" element={<PrivateRoute><WorkoutHistory /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
