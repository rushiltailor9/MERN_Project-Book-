import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import "../CSS/Admin.css";
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts"
import { getBooks } from "../API/bookApi";
import { getAllUsers } from "../API/userApi";
import { getAllOrders } from "../API/orderApi";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
 
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
            const response = await getAllUsers();
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

    const prepareRevenueData = (orderList) =>{
        const today = new Date();

        const month = [];
        for( let i = 5; i >= 0; i--){
            const date = new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            );

            month.push({
                year: date.getFullYear(),
                month: date.getMonth(),
                name: date.toLocaleString("en-US",{
                    month: "short"
                }),
                revenue: 0
            });
        }
        orderList.forEach((order)=>{
            if(order.orderStatus === "Cancelled"){
                return;
            }
            if(!order.createdAt){
                return;
            }
            const orderDate = new Date(order.createdAt);

            const year = orderDate.getFullYear();
            const month = orderDate.getMonth();

            const foundMonth = month.find(
                (item)=>
                    item.year === year &&
                    item.month === month
            );
            if(foundMonth){
                foundMonth.revenue += Number(order.totalAmount) || 0;
            }
        });
        return months.map((item)=>({
            month: item.name,
            revenue: Number(item.revenue.toFixed(2))
        }));
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
