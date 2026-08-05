import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import BookUpload from "./Components/BookUpload";
import Account from "./Components/Account";
import "./App.css";
import { useState } from "react";
import RefreshHandler from "./Components/RefreshHandler";
import Home from "./Components/Home";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState("");

    const protectedRoutes = ({ element }) => {
        return isLogin ? element : <Navigate to="/login" />;
    }
    return (
        <>
            <Navbar isLogin={isLogin} loggedInUser={loggedInUser} />
            <ToastContainer />
            <RefreshHandler setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books-upload" element={protectedRoutes({ element: <BookUpload /> })} />
                <Route path="/account" element={protectedRoutes({ element: <Account setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser} /> })} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    );
}

export default App;