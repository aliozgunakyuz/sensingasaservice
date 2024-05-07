import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterPage.css'; // Import CSS file

function Register() {
    const [fullname, setFullName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function isValidPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;
        return regex.test(password);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!fullname.trim() || !mail.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields correctly.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!isValidPassword(password)) {
            setError('Password must contain at least 8 characters, including one uppercase, one lowercase, one number, and one special character.');
            return;
        }

        setLoading(true);
        axios.post('http://localhost:8001/register', { fullname, mail, password })
            .then(result => {
                console.log(result);
                navigate('/');  // Adjust the path as needed
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 409) {
                    setError('Email already in use. Please use a different email.');
                } else {
                    setError('Failed to register. Please try again.');
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="register-container">
            <h2 className="heading">Register</h2>
            <p className="register-prompt">Already have an account? <a href="/login" className="login-link">Login</a></p>
            {error && <p className="register-error">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="fullname" className="label"><strong>Name</strong></label>
                    <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        autoComplete="off"
                        name="fullname"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mail" className="label"><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder="Enter Your Email"
                        autoComplete="off"
                        name="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label"><strong>Password</strong></label>
                    <input
                        type="password"
                        placeholder="Enter Your Password"
                        autoComplete="off"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="label"><strong>Confirm Password</strong></label>
                    <input
                        type="password"
                        placeholder="Re-enter Your Password"
                        autoComplete="off"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input"
                    />
                </div>
                <button type="submit" disabled={loading} className="button">
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;