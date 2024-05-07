import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterPage.css'; // Assuming the same styles can be shared
import { useAuth } from "../components/AuthContex";

function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(mail, password);  // Handle all login logic here
            navigate('/dashboard');  // Redirect on success
        } catch (error) {
            console.error("Login error:", error);
            alert('Failed to log in!');
        }
    };

    return (
        <div className=" register-container">
            <h2 className="heading">Login</h2>
            <p className="register-prompt">Don't you have an account? <a href="/register" className="login-link">Register</a></p>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="mail" className="label"><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder="Enter Your Email"
                        name="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label"><strong>Password</strong></label>
                    <input
                        type="password"
                        placeholder="Enter Your Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <button type="submit" className="button">Log In</button>
            </form>
        </div>
    );
}

export default Login;
