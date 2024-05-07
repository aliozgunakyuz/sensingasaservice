import React from 'react';
import { NavLink } from 'react-router-dom';


function NavigationBar() {

  return (
    <div className="navigation-bar">
      <div className="nav-title">Sensing as a Service</div>
      <div className="nav-links">

            <NavLink to="/register" >Register</NavLink>
            <NavLink to="/login" >Login</NavLink>

        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
        <NavLink to="/tutorial" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Tutorial</NavLink>
      </div>
    </div>
  );
}

export default NavigationBar;
