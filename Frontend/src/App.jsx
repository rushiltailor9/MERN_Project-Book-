import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
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
import AboutUs from "./Components/About-Us";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import BookUpload from "./Admin/BookUpload";
import AdminBooks from "./Admin/AdminBooks";
import AdminUsers from "./Admin/AdminUsers";
import AdminOrders from "./Admin/AdminOrders";
import AdminFeedback from "./Admin/AdminFeedback";
import Checkout from "./Components/Checkout";
import OrderSuccess from "./Components/OrderSuccess";
import MyOrders from "./Components/MyOrders";
import Favorites from "./Components/Favorite";
import Payment from "./Components/Payment";
import OrderComplete from "./Components/OrderComplete";
import Invoice from "./Components/Invoice";

function App() {
    const [isLogin, setIsLogin] = useState(() => Boolean(localStorage.getItem("token")));
    const [loggedInUser, setLoggedInUser] = useState(() => localStorage.getItem("name") || "");
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    const protectedRoutes = ({ element }) => {
        return isLogin ? element : <Navigate to="/login" />;
    }
    return (
        <>
            {!isAdminRoute && <Navbar isLogin={isLogin} loggedInUser={loggedInUser} />}
            <ToastContainer />
            <RefreshHandler setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={protectedRoutes({ element: <Account setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser} /> })} />
                <Route path="/books" element={<Books/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={protectedRoutes({element:<Cart setIsLogin={setIsLogin} setLoggedInUser={setLoggedInUser}/>})}/>
                <Route path="/contact" element={protectedRoutes({ element: <Contact loggedInUser={loggedInUser} /> })}/>
                <Route path="/feedback" element={protectedRoutes({ element: <Feedback loggedInUser={loggedInUser} /> })}/>
                <Route path="/about" element={<AboutUs/>}/>
                <Route path="/checkout" element={protectedRoutes({ element: <Checkout /> })}/>
                <Route path="/payment" element={protectedRoutes({ element: <Payment /> })}/>
                <Route path="/order-complete" element={protectedRoutes({ element: <OrderComplete /> })}/>
                <Route path="/order-success" element={protectedRoutes({ element: <OrderSuccess /> })}/>
                <Route path="/invoice/:orderId" element={protectedRoutes({ element: <Invoice /> })}/>
                <Route path="/my-orders" element={protectedRoutes({ element: <MyOrders /> })}/>
                <Route path="/account/favorites" element={ protectedRoutes({ element: <Favorites />})}/>
                <Route element={<ProtectedAdminRoute/>}>
                    <Route 
                        path="/admin/dashboard"
                        element={<AdminDashboard/>}
                    />
                    <Route 
                        path="/admin/book"
                        element={<BookUpload/>}
                    />
                    <Route 
                        path="/admin/books"
                        element={<AdminBooks/>}
                    />
                    <Route 
                        path="/admin/users"
                        element={<AdminUsers/>}
                    />
                    <Route 
                        path="/admin/orders"
                        element={<AdminOrders/>}
                    />
                    <Route 
                        path="/admin/feedback"
                        element={<AdminFeedback/>}
                    />
                </Route>
            </Routes>
            {!isAdminRoute && <Footer isLogin={isLogin} loggedInUser={loggedInUser} />}
        </>
    );
}

export default App;
