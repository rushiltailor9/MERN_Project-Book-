// import BookUpload from "../Components/BookUpload"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import "../CSS/Admin.css";
import { useEffect, useState } from "react";
import { getBooks } from "../API/bookApi";
import { getUsers } from "../API/userApi";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchDashboard = async() =>{
        try{
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/admin/dashboard",
                {
                    method: "GET",

                    headers: {
                        "Authorization":`Bearer ${token}`,
                        "Content-Type": "appliction/json"   
                    }
                }
            );
            const result = await response.json;
            if(result.success){
                setDashboard(result);
            }else{
                console.log(result.message);
            }
        }catch(error){
            console.log("Dashboard Error",error);
        }finally{
            setLoading(false);
        }
    };
    const fetchBooks = async() =>{
        try{
            const response = await getBooks();
            setBooks(response.data);
        }catch(error){
        console.log(error)
        }finally{
            setLoading(false);
        }
    }
    const fetchUser = async() =>{
        try{
            const response = await getUsers();
            setUsers(response.data);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchDashboard(),
        fetchBooks(),
        fetchUser()
    },[]);

    if(loading){
        return (
            <div className="admin-loading">
                Loading Dashboard
            </div>
        )
    }



  return (
            <div className="admin-container">

            {/* Sidebar */}

            <AdminSidebar />


            {/* Main */}

            <div className="admin-main">

                <AdminHeader />


                <div className="admin-content">

                    <h1>
                        Dashboard
                    </h1>

                    <p className="welcome-text">
                        Welcome to READ-EASY Admin Panel
                    </p>


                    {/* Cards */}

                    <div className="dashboard-cards">

                        <div className="dashboard-card">

                            <h3>
                                Total Users
                            </h3>

                            <h2>
                                {users.length}
                            </h2>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                Total Books
                            </h3>

                            <h2>
                                {books.length}
                            </h2>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                Total Orders
                            </h3>

                            <h2>
                                0
                            </h2>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                Total Revenue
                            </h3>

                            <h2>
                                ₹0
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

            </div>

        </div>

  )
}

export default AdminDashboard