import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const res = await fetch("/api/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.errors) {
                setErrors(data.errors);
            } else if (res.status === 401 || res.status === 422) {
                // tangani error dari laravel
                setErrors({ email: [data.message || "Invalid credentials"] });
            } else if (res.ok) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 sm:mt-16 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Masuk ke Akun</h1>

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className={`block w-full border ${errors.email ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.email[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kata Sandi
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        className={`block w-full border ${errors.password ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.password[0]}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button 
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
