import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <div className="navigation-bar">
      <div className="nav-title">Sensing as a Service</div>
      <div className="nav-links">
        <NavLink to="/login" className="nav-link" activeClassName="active">Login</NavLink>
        <NavLink to="/register" className="nav-link" activeClassName="active">Register</NavLink>
      </div>
    </div>
  );
}

export default NavigationBar;
