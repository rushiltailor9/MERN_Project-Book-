import { Link } from "react-router-dom";
import "../CSS/LoginRegister.css";

const Login = () => {
    return (
        <div className="auth-container">
            <form className="auth-form">
                <h2>Login</h2>

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

                <button type="submit">Login</button>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;