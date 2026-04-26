import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EmployeeList from './pages/EmployeeList';
import InternList from './pages/InternList';
import StateList from './pages/StateList';
import CityList from './pages/CityList';
import DepartmentList from './pages/DepartmentList';
import LeaveRequestList from './pages/LeaveRequestList';
import AttendanceList from './pages/AttendanceList';
import PayslipList from './pages/PayslipList';
import ExpenseList from './pages/ExpenseList';
import AssetList from './pages/AssetList';
import AuditLogList from './pages/AuditLogList';
import RecognitionWall from './pages/RecognitionWall';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import * as AuthService from './services/AuthService';
import './index.css';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const location = useLocation();
  const mainContentRef = React.useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location]);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <div className="app-container">
      {user && (
        <aside className="sidebar">
          <div className="logo">
            <span style={{ fontSize: '1.5rem' }}>🚀</span>
            <span>EMP-CRUD</span>
          </div>
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
            
            {!isEmployee && (
              <>
                <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Employees</NavLink>
                <NavLink to="/interns" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Interns</NavLink>
                
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>MASTER DATA</p>
                </div>
                
                <NavLink to="/departments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Departments</NavLink>
                <NavLink to="/states" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>States</NavLink>
                <NavLink to="/cities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Cities</NavLink>
                
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>HR MANAGEMENT</p>
                </div>
                
                <NavLink to="/leave-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Leave Requests</NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Attendance</NavLink>
                
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>FINANCE</p>
                </div>
                
                <NavLink to="/payslips" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Payslips</NavLink>
                <NavLink to="/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Expenses</NavLink>
                
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>IT ASSETS</p>
                </div>
                
                <NavLink to="/assets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Company Assets</NavLink>
                
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>SYSTEM</p>
                </div>
                
                <NavLink to="/audit-logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Audit Trails</NavLink>
              </>
            )}
            
            <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>COMMUNITY</p>
            </div>
            
            <NavLink to="/recognition" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Recognition Wall</NavLink>
            
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Logged in as {user.name}</p>
              <button className="btn btn-outline" style={{ width: '100%', color: 'var(--danger)' }} onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        </aside>
      )}

      <main className="main-content" ref={mainContentRef}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            !user ? <Navigate to="/login" /> : 
            isEmployee ? <EmployeeDashboard user={user} /> : <Dashboard />
          } />
          
          <Route path="/employees" element={user && !isEmployee ? <EmployeeList /> : <Navigate to="/" />} />
          <Route path="/interns" element={user && !isEmployee ? <InternList /> : <Navigate to="/" />} />
          <Route path="/departments" element={user && !isEmployee ? <DepartmentList /> : <Navigate to="/" />} />
          <Route path="/states" element={user && !isEmployee ? <StateList /> : <Navigate to="/" />} />
          <Route path="/cities" element={user && !isEmployee ? <CityList /> : <Navigate to="/" />} />
          <Route path="/leave-requests" element={user && !isEmployee ? <LeaveRequestList /> : <Navigate to="/" />} />
          <Route path="/attendance" element={user && !isEmployee ? <AttendanceList /> : <Navigate to="/" />} />
          <Route path="/payslips" element={user && !isEmployee ? <PayslipList /> : <Navigate to="/" />} />
          <Route path="/expenses" element={user && !isEmployee ? <ExpenseList /> : <Navigate to="/" />} />
          <Route path="/assets" element={user && !isEmployee ? <AssetList /> : <Navigate to="/" />} />
          <Route path="/audit-logs" element={user && !isEmployee ? <AuditLogList /> : <Navigate to="/" />} />
          <Route path="/recognition" element={user ? <RecognitionWall /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState({ employees: 0, interns: 0, departments: 0, cities: 0, states: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/stats/counts`);
        setStats(res.data);
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <header className="header"><h1 className="title">Admin Dashboard</h1></header>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Employees" count={stats.employees} color="#6366f1" />
        <StatCard title="Total Interns" count={stats.interns} color="#10b981" />
        <StatCard title="Departments" count={stats.departments} color="#f59e0b" />
        <StatCard title="Cities" count={stats.cities} color="#ef4444" />
        <StatCard title="States" count={stats.states} color="#8b5cf6" />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className="card glass-card" style={{ borderLeft: `5px solid ${color}` }}>
    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{count}</p>
  </div>
);

export default App;
