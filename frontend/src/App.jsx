import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import StudentList from './pages/StudentList';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
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
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/students" element={<StudentList />} />
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
