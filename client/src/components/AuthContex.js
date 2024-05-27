import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = async (mail, password) => {
        try {
            const response = await axios.post('http://localhost:8001/login', { mail, password });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('auth-token', response.data.token);
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
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('auth-token');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('auth-token');
        if (loggedInUser && savedToken) {
            try {
                const userObject = JSON.parse(loggedInUser);
                setUser(userObject);
                setToken(savedToken);
            } catch (e) {
                console.error("Failed to parse user data:", e);
            }
        }
    }, []);

    const getUserId = () => {
        return user ? user._id : null;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, getUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
