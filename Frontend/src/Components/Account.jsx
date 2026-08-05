import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    if (setIsLogin) setIsLogin(false);
    if (setLoggedInUser) setLoggedInUser("");
    handleSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="account-container">
      <h2 className="account-welcome-heading">Welcome {userName}</h2>
      <button onClick={handleLogout} className="account-logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Account;