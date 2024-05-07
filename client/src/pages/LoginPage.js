import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterPage.css'; // Assuming the same styles can be shared


function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8001/login', { mail, password })
            .then(response => {
                console.log("Login successful:", response.data);
                navigate('/dashboard'); // Redirect to dashboard on successful login
            })
            .catch(error => {
                console.error("Login error:", error);
                alert('Failed to log in!');
            });
    };

    return (
        <div className="container">
            <h2 className="heading">Login</h2>
            <p className="login-prompt">Don't you have an account? <a href="/register" className="login-link">Register</a></p>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="mail" className="label">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        name="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
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
