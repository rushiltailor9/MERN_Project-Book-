import { Link, useNavigate } from "react-router-dom"
import "../CSS/Admin.css";
import { RiLogoutBoxLine } from "react-icons/ri";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");

        navigate("/login");
    };
  return (
    <aside className="admin-sidebar">

            {/* Logo */}

            <div className="admin-logo">
                READ-EASY
            </div>


            {/* Navigation */}

            <nav className="admin-nav">

                <Link to="/admin/dashboard">
                     Dashboard
                </Link>


                <Link to="/admin/books">
                    Books
                </Link>

                <Link to="/admin/book">
                    Book Upload
                </Link>


                <Link to="/admin/users">
                    Users
                </Link>


                <Link to="/admin/orders">
                     Orders
                </Link>


                <Link to="/admin/feedback">
                     Feedback
                </Link>

                <Link to="/admin/discount">
                    Discount
                </Link>
            </nav>


            {/* Logout */}

            <button
                className="admin-logout"
                onClick={handleLogout}
            >
                Logout <RiLogoutBoxLine/>
            </button>

        </aside>
  )
}

export default AdminSidebar