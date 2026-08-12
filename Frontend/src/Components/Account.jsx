import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleSuccess } from "../utils";
import "../CSS/Account.css";

const Account = ({ setIsLogin, setLoggedInUser }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name && name !== "undefined") {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("cart");
    localStorage.removeItem("role");
    if (setIsLogin) setIsLogin(false);
    if (setLoggedInUser) setLoggedInUser("");
    handleSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="account-container" style={{ textAlign: "center", padding: "60px 20px" }}>
      <h2 className="account-welcome-heading">Welcome, {userName || "User"}!</h2>
      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Manage your account and track your orders</p>
      
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", alignItems: "center" }}>
        <Link 
          to="/my-orders" 
          style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#38bdf8", 
            color: "#0f172a", 
            fontWeight: "600", 
            borderRadius: "8px", 
            textDecoration: "none" 
          }}
        >
           My Orders
        </Link>
        <button 
          onClick={handleLogout} 
          className="account-logout-btn" 
          style={{ padding: "12px 24px", borderRadius: "8px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;