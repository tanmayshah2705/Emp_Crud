import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import StudentList from './pages/StudentList';
import Login from './pages/Login';
import * as AuthService from './services/AuthService';
import './index.css';

function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && (
          <aside className="sidebar">
            <div className="logo">
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
              <span>EMP-CRUD</span>
            </div>
            <nav className="nav-links">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Employees
              </NavLink>
              <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Students
              </NavLink>
              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Logged in as {user.name}</p>
                <button className="btn btn-outline" style={{ width: '100%', color: 'var(--danger)' }} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </nav>
          </aside>
        )}

        <main className="main-content" style={{ marginLeft: user ? '0' : '0' }}>
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/employees" element={user ? <EmployeeList /> : <Navigate to="/login" />} />
            <Route path="/students" element={user ? <StudentList /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Dashboard = () => (
  <div>
    <header className="header">
      <h1 className="title">Dashboard</h1>
    </header>
    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div className="card glass-card">
        <h3>Total Employees</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>124</p>
      </div>
      <div className="card glass-card">
        <h3>Total Students</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>45</p>
      </div>
      <div className="card glass-card">
        <h3>Active Departments</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>8</p>
      </div>
    </div>
  </div>
);

export default App;
