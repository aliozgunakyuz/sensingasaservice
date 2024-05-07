import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContex';

function NavigationBar() {
  const { user, logout } = useAuth();

  return (
    <div className="navigation-bar">
      <div className="nav-title">Sensing as a Service</div>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/user-profile" className="nav-link">Profile</NavLink>
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
