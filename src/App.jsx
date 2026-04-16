import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Posts/Create";
import Show from "./Pages/Posts/Show";
import Update from "./Pages/Posts/Update";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";

export default function App() {
    const { user } = useContext(AppContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    {/* Guest Only */}
                    <Route path="/register" element={user ? <Home /> : <Register />} />
                    <Route path="/login" element={user ? <Home /> : <Login />} />

                    {/* Public Detail */}
                    <Route path="/posts/:id" element={<Show />} />

                    {/* Auth Only */}
                    <Route path="/create" element={user ? <Create /> : <Login />} />
                    <Route
                        path="/posts/update/:id"
                        element={user ? <Update /> : <Login />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
