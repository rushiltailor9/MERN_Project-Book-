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
import Books from "./Components/Books";
import Footer from "./Components/Footer";
import Cart from "./Components/Cart";
import Contact from "./Components/Contact-Us";
import Feedback from "./Components/Feedback";

function App() {
    const [isLogin, setIsLogin] = useState(() => Boolean(localStorage.getItem("token")));
    const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem("name") || "");

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
                <Route path="/books-upload" element={protectedRoutes({ element: <BookUpload loggedInUser={loggedInUser} /> })} />
                <Route path="/account" element={protectedRoutes({ element: <Account setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser} /> })} />
                <Route path="/books" element={<Books/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={protectedRoutes({element:<Cart setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser}/>})}/>
                <Route path="/contact" element={protectedRoutes({ element: <Contact loggedInUser={loggedInUser} /> })}/>
                <Route path="/feedback" element={protectedRoutes({ element: <Feedback loggedInUser={loggedInUser} /> })}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;