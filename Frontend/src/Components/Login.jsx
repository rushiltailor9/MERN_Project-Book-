import { Link, useNavigate } from "react-router-dom";
import "../CSS/LoginRegister.css";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { handleError, handleSuccess } from "../utils";

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email:"",
        password:""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

//Get value from inputbox
const handleChange = (e) =>{
    const { name, value } = e.target; //fetch change value in input
    console.log(name,value);
    const copyLoginInfo = {... loginInfo}; //create copy spred into state
    copyLoginInfo[name] = value; 
    setLoginInfo(copyLoginInfo); //set value in state
} 

//Register API calling
const handleLogin = async(e) =>{
    e.preventDefault();
    const { email, password } = loginInfo; //client
    if( !email || !password ){ //validation
        return handleError("All Filed is require...");
    }

    try{
        const url = "http://localhost:5000/auth/login"; //api
        const response = await fetch(url,{ //get api response
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(loginInfo) //convert body into string
        });
        const result = await response.json(); //bind into JSON
        const { message, success, jwtToken, name, email, role,error } = result;
        if(success){
            handleSuccess(message); //toast message Success form utils.js
            localStorage.setItem('token',jwtToken);
            localStorage.setItem('name', name || email || "");
            localStorage.setItem("role",role);
            setTimeout(()=>{
                if( role === "admin"){
                    navigate("/admin/dashboard");
                }else{
                    navigate("/");
                }
            })
        }else{
            const errorMessage = typeof error === 'string' ? error : message || "Registration failed"; //check error
            handleError(errorMessage);
        }
    }catch(error){
        handleError(error.message || "Something went wrong");
    }
}
    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Login</h2>

                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange}
                    value={loginInfo.email}
                />

                <div className="password-field">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange}
                        value={loginInfo.password}
                    />
                    <span
                        className="password-toggle-icon"
                        onClick={()=>setShowPassword((prev)=>!prev)}
                        role="button"
                        tabIndex={0}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter" || e.key === ""){
                                setShowPassword((prev)=>!prev);
                            }
                        }}
                    >
                        {showPassword ? <FiEyeOff/> : <FiEye/>}
                    </span>
                </div>

                <button type="submit">Login</button>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;