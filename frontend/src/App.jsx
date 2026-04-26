import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const mainContentRef = React.useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`${API_BASE}/notifications/${user.username}`);
          setNotifications(res.data);
        } catch (e) { console.error(e); }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <div className="app-container">
      {user && (
        <aside className="sidebar">
          <div className="logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
              <span>EMP-CRUD</span>
            </div>
            <NotificationBell notifications={notifications} setNotifications={setNotifications} />
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

const NotificationBell = ({ notifications, setNotifications }) => {
  const [show, setShow] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE}/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShow(!show)} className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--danger)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.6rem' }}>
            {unreadCount}
          </span>
        )}
      </button>
      {show && (
        <div className="card glass-card" style={{ position: 'absolute', top: '100%', right: 0, width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 100, padding: '1rem', marginTop: '0.5rem' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Notifications</h4>
          {notifications.length === 0 ? <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No notifications</p> : 
            notifications.map(n => (
              <div key={n.id} onClick={() => markAsRead(n.id)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: n.read ? 'transparent' : '#f1f5f9', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: n.read ? '400' : '600' }}>{n.message}</p>
                <small style={{ color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

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
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Total Employees" count={stats.employees} color="#6366f1" />
        <StatCard title="Total Interns" count={stats.interns} color="#10b981" />
        <StatCard title="Departments" count={stats.departments} color="#f59e0b" />
        <StatCard title="Cities" count={stats.cities} color="#ef4444" />
        <StatCard title="States" count={stats.states} color="#8b5cf6" />
      </div>

      <div className="card glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome to HRMS Pro</h2>
        <p style={{ color: 'var(--text-muted)' }}>Use the sidebar to manage employees, payroll, and more.</p>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className="card glass-card" style={{ borderLeft: `5px solid ${color}` }}>
    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{count}</p>
  </div>
);

export default App;
