import { Link } from "react-router-dom";
import "../CSS/LoginRegister.css";

const Register = () => {
    return (
        <div className="auth-container">
            <form className="auth-form">
                <h2>Sign Up</h2>

                <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                />

                <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name" 
                />

                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                />

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
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