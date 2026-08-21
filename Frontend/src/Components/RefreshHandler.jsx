import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

const RefreshHandler = ({ setIsLogin, setLoggedInUser }) =>{

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            setIsLogin(true);
            if (setLoggedInUser) {
                setLoggedInUser(localStorage.getItem("name") || "");
            }
            if (location.pathname === "/login" || location.pathname === "/register") {
                const role = localStorage.getItem("role");
                if (role === "admin") {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }
        } else {
            setIsLogin(false);
            if (setLoggedInUser) {
                setLoggedInUser("");
            }
        }
    }, [location, navigate, setIsLogin, setLoggedInUser]);

    useEffect(() => {
        const handleAuthLogout = () => {
            setIsLogin(false);
            if (setLoggedInUser) {
                setLoggedInUser("");
            }
        };

        window.addEventListener("auth-logout", handleAuthLogout);
        return () => {
            window.removeEventListener("auth-logout", handleAuthLogout);
        };
    }, [setIsLogin, setLoggedInUser]);
    return(
        null
    )
}

export default RefreshHandler;