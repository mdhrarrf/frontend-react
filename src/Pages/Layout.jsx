import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
    const { user, token, setToken, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        try {
            const res = await fetch("/api/logout", {
                method: "post",
                headers: { 
                    Accept: "application/json",
                    Authorization: `Bearer ${token}` 
                },
            });
            // tangani status 401 atau logout sukses
            if (res.ok || res.status === 401) {
                setUser(null); 
                setToken(null);
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <nav className="flex justify-between items-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                    <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
                        Instagram Lite
                    </Link>

                    <div className="flex items-center space-x-6 sm:space-x-8">
                        <Link 
                            to="/" 
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Beranda
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4 sm:space-x-6">
                                <Link 
                                    to="/create" 
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
                                >
                                    Postingan Baru
                                </Link>
                                <div className="hidden sm:block w-px h-5 bg-gray-200"></div>
                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                <button 
                                    onClick={handleLogout} 
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/register" 
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Daftar
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
