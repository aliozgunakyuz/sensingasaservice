import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Make sure you create a Sidebar.css file for styles

function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Dashboard
      </NavLink>
      <NavLink to="/sensors" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Sensors
      </NavLink>
      <NavLink to="/ml-algorithms" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        ML Algorithms
      </NavLink>
      <NavLink to="/apis" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Your APIs
      </NavLink>
      <NavLink to="/data" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Data
      </NavLink>
      {/* Repeat for other links as necessary */}
    </div>
  );
}

export default Sidebar;
