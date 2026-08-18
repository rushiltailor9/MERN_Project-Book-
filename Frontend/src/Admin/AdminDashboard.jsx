import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import "../CSS/Admin.css";
import { useEffect, useState } from "react";
import { getBooks } from "../API/bookApi";
import { getUsers } from "../API/userApi";
import { getAllOrders } from "../API/orderApi";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/admin/dashboard",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                setDashboard(result);
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log("Dashboard Error", error);
        }
    };
    const fetchBooks = async () => {
        try {
            const response = await getBooks();
            setBooks(response.data || []);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchUser = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            if (response.success && response.orders) {
                setOrders(response.orders);
            }
        } catch (error) {
            console.log("Order fetch error", error);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchDashboard(),
                    fetchBooks(),
                    fetchUser(),
                    fetchOrders()
                ]);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const totalOrders = orders.length;

    /* Calculate revenue from orders where status is not Canceled */
    const totalRevenue = orders.reduce((sum, order) => {
        if (order.orderStatus !== "Cancelled") {
            return sum + (Number(order.totalAmount) || 0);
        }
        return sum;
    }, 0);

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <AdminSidebar />
            {/* Main */}
            <div className="admin-main">
                <AdminHeader />
                {loading ? (
                    <div className="admin-loading">
                        Loading Dashboard
                    </div>
                ) : (
                <div className="admin-content">
                    <h1>
                        Dashboard
                    </h1>
                    <p className="welcome-text">
                        Welcome to READ-EASY Admin Panel
                    </p>
                    {/* Cards */}
                    <div className="dashboard-cards">
                        <div className="dashboard-card card-blue">
                            <h3>
                                Total Users
                            </h3>
                            <h2>
                                {users.length}
                            </h2>
                        </div>
                        <div className="dashboard-card card-green">
                            <h3>
                                Total Books
                            </h3>
                            <h2>
                                {books.length}
                            </h2>
                        </div>
                        <div className="dashboard-card card-purple">
                            <h3>
                                Total Orders
                            </h3>
                            <h2>
                                {totalOrders}
                            </h2>
                        </div>
                        <div className="dashboard-card card-amber">
                            <h3>
                                Total Revenue
                            </h3>
                            <h2>
                                ₹{totalRevenue.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                    {/* Admin Status */}
                    <div className="dashboard-section">
                        <h2>
                            Admin Status
                        </h2>
                        <p>
                            {dashboard?.message}
                        </p>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
