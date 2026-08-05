import { Link, useNavigate } from "react-router-dom";
import "../CSS/LoginRegister.css";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email:"",
        password:""
    });
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
        const { message, success, jwtToken, name, email, error } = result;
        if(success){
            handleSuccess(message); //toast message Success form utils.js
            localStorage.setItem('token',jwtToken);
            localStorage.setItem('name', name || email || "");
            setTimeout(()=>{
                navigate("/books-upload"); //navigate to login page
            }, 1000);
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

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    value={loginInfo.password}
                />

                <button type="submit">Login</button>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;