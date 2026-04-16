import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = useCallback(async () => {
        try {
            const res = await fetch("/api/posts", {
                headers: { Accept: "application/json" }
            });
            const data = await res.json();
            if (res.ok) { 
                setPosts(data); 
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // optimasi frame dan cegah error setstate
        requestAnimationFrame(() => {
            queueMicrotask(() => getPosts());
        });
    }, [getPosts]);

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-2xl font-bold text-gray-900">Postingan</h1>
                <p className="mt-2 text-sm text-gray-500">Kumpulan postingan terbaru.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm animate-pulse h-32"></div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="flex flex-col space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="relative bg-white border border-gray-200 hover:border-blue-300 p-5 rounded-lg shadow-sm transition-colors duration-200 group">
                            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                <Link to={`/posts/${post.id}`}>
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    {post.title}
                                </Link>
                            </h2>
                            <div className="mt-1 flex items-center text-sm text-gray-500 space-x-2">
                                <span className="font-medium text-gray-700">{post.user?.name}</span>
                                <span>&middot;</span>
                                <time dateTime={post.created_at}>
                                    {new Date(post.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
                                </time>
                            </div>
                            <p className="mt-3 text-base text-gray-600 line-clamp-2 leading-relaxed">
                                {post.body}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Baca selengkapnya &rarr;
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 p-10 text-center rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Belum ada postingan.</p>
                </div>
            )}
        </div>
    );
}
