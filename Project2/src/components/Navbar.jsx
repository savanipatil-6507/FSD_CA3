import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          <span style={{ fontSize: '1.6rem' }}>🏥</span>
          <span>MediCare Hospital</span>
        </NavLink>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/appointments"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/book"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              + Book Appointment
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

