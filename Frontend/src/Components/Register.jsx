import { Link, useNavigate } from "react-router-dom";
import "../CSS/LoginRegister.css";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";

const Register = () => {
    const [registerInfo, setRegisterInfo] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    });
    const navigate = useNavigate();

//Get value from inputbox
const handleChange = (e) =>{
    const { name, value } = e.target; //fetch change value in input
    console.log(name,value);
    const copyRegisterInfo = {... registerInfo}; //create copy spred into state
    copyRegisterInfo[name] = value; 
    setRegisterInfo(copyRegisterInfo); //set value in state
} 

//Register API calling
const handleRegister = async(e) =>{
    e.preventDefault();
    const {firstName, lastName, email, password} = registerInfo; //client
    if( !firstName || !lastName || !email || !password ){ //validation
        return handleError("All Filed is require...");
    }
    try{
        const url = "http://localhost:5000/auth/register"; //api
        const response = await fetch(url,{ //get api response
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(registerInfo) //convert body into string
        });
        const result = await response.json(); //bind into JSON
        const { message, success, error } = result;
        if(success){
            handleSuccess(message); //toast message Success form utils.js
            setTimeout(()=>{
                navigate("/login"); //navigate to login page
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
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Sign Up</h2>

                <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                    onChange={handleChange}
                    value={registerInfo.firstName}
                />

                <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name"
                    onChange={handleChange} 
                    value={registerInfo.lastName}
                />

                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange}
                    value={registerInfo.email}
                />

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    value={registerInfo.password}
                />

                <button type="submit">Sign Up</button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;