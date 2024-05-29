import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContex';
import './NavigationBar.css'

function NavigationBar() {
  const { user, logout } = useAuth();

  return (
    <div className="navigation-bar">
      <NavLink to="/dashboard" className="nav-title">Sensing as a Service</NavLink>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/pipeline" className="nav-link">Create Pipeline</NavLink>
            <button onClick={logout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default NavigationBar;
