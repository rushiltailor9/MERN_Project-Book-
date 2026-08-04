import { Link } from "react-router-dom";
import "../CSS/Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <span className="logo-text">BookShop</span>
                </Link>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/books-upload">Books Upload</Link>
                </li>
            </ul>

            <div className="navbar-auth">
                <Link to="/login" className="auth-icon-btn" title="Login">
                    Login
                </Link>
   
                <Link to="/register" className="auth-icon-btn auth-icon-btn--primary" title="Sign Up">
                    Signup
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;