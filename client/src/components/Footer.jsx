function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-gray-800 px-8 py-10 mt-auto text-gray-400">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">About FitLog</h3>
                    <p className="text-sm leading-relaxed">
                        FitLog is a full-stack fitness tracking app that lets you log workouts, track exercises, and monitor your progress over time. Built with React, Node.js, Express, and PostgreSQL.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">About the Author</h3>
                    <p className="text-sm mb-4">Built by Themba Chika — Junior SWE @ James Madison University.</p>
                    <div className="flex gap-6">
                        <a
                            href="https://github.com/ayeethemba"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm uppercase tracking-wider transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/thembachika"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm uppercase tracking-wider transition-colors"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600 uppercase tracking-widest">
                © 2025 FitLog. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
