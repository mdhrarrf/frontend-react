import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Create() {
    const { token, setToken, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        body: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate(e) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const res = await fetch("/api/posts", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.status === 401) {
                // tangani respon 401
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (data.errors) {
                setErrors(data.errors);
            } else if (res.ok) {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    Buat Postingan
                </h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    &larr; Kembali
                </button>
            </div>

            <form onSubmit={handleCreate} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 sm:p-8 space-y-6">
                {/* input judul */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Judul
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className={`block w-full border ${errors.title ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                    />
                    {errors.title && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.title[0]}
                        </p>
                    )}
                </div>

                {/* area konten */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Isi Postingan
                    </label>
                    <textarea
                        rows="10"
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        className={`block w-full border ${errors.body ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 resize-y transition-colors`}
                    ></textarea>
                    {errors.body && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.body[0]}
                        </p>
                    )}
                </div>

                {/* tombol submit */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                        disabled={isLoading}
                        className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
