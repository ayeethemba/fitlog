import { Navigate } from "react-router-dom";
import { isTokenValid, clearSession } from "../utils/auth.js";

function PrivateRoute({ children }) {
    if (!isTokenValid()) {
        clearSession();
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
