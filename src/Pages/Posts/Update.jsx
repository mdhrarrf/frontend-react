import { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user, setToken, setUser } = useContext(AppContext);

    const [formData, setFormData] = useState({
        title: "",
        body: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const getPost = useCallback(async () => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                headers: { Accept: "application/json" }
            });
            const data = await res.json();

            if (res.ok) {
                // cek auth untuk author
                if (user && data.post.user_id !== user.id) {
                    navigate("/");
                } else {
                    setFormData({
                        title: data.post.title,
                        body: data.post.body,
                    });
                }
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Gagal mengambil detail post:", error);
        } finally {
            setIsLoadingInit(false);
        }
    }, [id, user, navigate]);

    useEffect(() => {
        // cegah warning setstate
        requestAnimationFrame(() => {
            queueMicrotask(() => getPost());
        });
    }, [getPost]);

    async function handleUpdate(e) {
        e.preventDefault();
        setIsUpdating(true);
        setErrors({});

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.status === 401) {
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (data.errors) {
                setErrors(data.errors);
            } else if (res.ok) {
                navigate(`/posts/${id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoadingInit) {
        return (
            <div className="max-w-3xl mx-auto mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-8 animate-pulse h-64"></div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    Ubah Postingan
                </h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    &larr; Batal
                </button>
            </div>

            <form onSubmit={handleUpdate} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 sm:p-8 space-y-6">
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
                        disabled={isUpdating}
                        className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
