import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function NotFound() {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
                <p className="text-8xl font-black text-purple-400 mb-4">404</p>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Page not found</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">That route doesn't exist</p>
                <Link
                    to="/dashboard"
                    className="bg-blue-400 text-gray-950 px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-blue-300 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </main>
            <Footer />
        </div>
    );
}

export default NotFound;
