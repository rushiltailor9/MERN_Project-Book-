import { Link } from "react-router-dom";
import "../CSS/Navbar.css";
import { FaShoppingCart } from "react-icons/fa";


const Navbar = ({ isLogin, loggedInUser }) => {
    const rawName = loggedInUser || localStorage.getItem("name") || "";
    const user = rawName === "undefined" ? "" : rawName;

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <span className="logo-text">ReadEasy</span>
                </Link>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/books">Books</Link>
                </li>
                <li>
                    <Link to="/contact">Contact-Us</Link>
                </li>
                <li>
                    <Link to="/about">About-Us</Link>
                </li>
                <li>
                    <Link to="/feedback">Feedback</Link>
                </li>
            </ul>

            <div className="navbar-auth">
                <Link to="/cart"  className="cart-link">
                            <FaShoppingCart className="cart-icon"/>
                </Link>
                <Link to="/account" className="account-icon-btn" title="Account">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="account-icon"
                    >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </Link>
                

                {isLogin && user ? (
                    <span className="navbar-user-name">{user}</span>
                ) : (
                    <>
                        <Link to="/login" className="auth-icon-btn" title="Login">
                            Login
                        </Link>

                        <Link to="/register" className="auth-icon-btn auth-icon-btn--primary" title="Sign Up">
                            Signup
                        </Link>

                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;