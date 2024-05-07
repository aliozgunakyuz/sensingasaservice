import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContex.js'; // Adjust this path based on your project structure

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
