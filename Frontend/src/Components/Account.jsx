import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleSuccess } from "../utils";
import "../CSS/Account.css";
import { RiLogoutBoxLine  } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";

const Account = ({ setIsLogin, setLoggedInUser }) => {
  const [userName] = useState(() => {
    const name = localStorage.getItem("name");
    return (name && name !== "undefined") ? name : "";
  });
  const navigate = useNavigate();

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
            color: "white", 
            fontWeight: "600", 
            borderRadius: "8px", 
            textDecoration: "none" 
          }}
        >
           My Orders
        </Link>
        <Link 
          to="/account/favorites"
          style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#2563EB", 
            color: "white", 
            fontWeight: "600", 
            borderRadius: "8px", 
            textDecoration: "none" 
          }}
        >
            Favorites <MdFavoriteBorder/>
        </Link>
        <button 
          onClick={handleLogout} 
          style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#DC2626",
            cursor:"pointer", 
            height: "50px",
            width:"120px",
            color: "white", 
            fontWeight: "600", 
            borderRadius: "8px", 
            textDecoration: "none",
            border: "none"
          }}
        >
          Logout <RiLogoutBoxLine />
        </button>
      </div>
    </div>
  );
};

export default Account;