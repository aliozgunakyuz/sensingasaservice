import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (mail, password) => {
        try {
            const response = await axios.post('http://localhost:8001/login', { mail, password });
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log("User logged in successfully: ", user);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8001/logout');
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            try {
                const userObject = JSON.parse(loggedInUser);
                setUser(userObject);
            } catch (e) {
                console.error("Failed to parse user data:", e);
            }
        }
    }, []);
    
    

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
