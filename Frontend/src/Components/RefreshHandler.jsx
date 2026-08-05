import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

const RefreshHandler = ({ setIsLogin, setLoggedInUser }) =>{

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setIsLogin(true);
            if (setLoggedInUser) {
                setLoggedInUser(localStorage.getItem('name') || "");
            }
            if(location.pathname === "/login" || location.pathname === "/register" ){
                navigate("/books-upload",{replace:false});
            }
        }
    },[location, navigate, setIsLogin, setLoggedInUser]);
    return(
        null
    )
}

export default RefreshHandler;