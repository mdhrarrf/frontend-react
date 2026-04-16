import { useContext, useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, setToken, setUser } = useContext(AppContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const getPost = useCallback(async () => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                headers: { Accept: "application/json" }
            });
            const data = await res.json();

            if (res.ok) {
                setPost(data.post);
            } else if (res.status === 404) {
                navigate("/"); // redirect jika tidak ditemukan
            }
        } catch (error) {
            console.error("Gagal mengambil detail post:", error);
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // cegah warning setstate di effect
        requestAnimationFrame(() => {
            queueMicrotask(() => getPost());
        });
    }, [getPost]);

    async function handleDelete(e) {
        e.preventDefault();

        if (confirm("Apakah Anda yakin ingin menghapus postingan ini secara permanen?")) {
            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: "delete",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401) {
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                if (res.ok) {
                    navigate("/");
                } else {
                    const data = await res.json();
                    console.error("Gagal menghapus:", data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 mb-12">
            <div className="mb-6">
                <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    &larr; Kembali
                </Link>
            </div>

            {loading ? (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 animate-pulse h-64"></div>
            ) : post ? (
                <article className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <header className="px-6 py-6 sm:px-8 sm:py-8 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                    {post.title}
                                </h1>
                                <div className="flex items-center text-sm font-medium text-gray-500 space-x-2">
                                    <span>Oleh <span className="text-gray-700">{post.user.name}</span></span>
                                    <span>&middot;</span>
                                    <time dateTime={post.created_at}>
                                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </time>
                                </div>
                            </div>

                            {/* cek auth untuk author */}
                            {user && user.id === post.user_id && (
                                <div className="flex items-center space-x-3 shrink-0">
                                    <Link
                                        to={`/posts/update/${post.id}`}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Ubah
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="px-6 py-8 sm:px-8 text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {post.body}
                    </div>
                </article>
            ) : (
                <div className="text-center p-12 bg-white shadow-sm border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Post not found.</p>
                </div>
            )}
        </div>
    );
}
