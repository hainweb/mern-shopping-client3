import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function AdminHeader({ isAdmin, adminSec }) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/admin">Admin Panel</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/all-users">All Users</Link>
            </li>
          </ul>

          <div className="loginbutton-container">
            {isAdmin ? (
              <Link to="/admin/logout">
                <button className="loginbutton">{adminSec.Name} / Log Out</button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <button className="loginbutton">Login / Sign Up</button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default AdminHeader;
