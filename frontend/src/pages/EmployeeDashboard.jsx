import React from 'react';

const EmployeeDashboard = ({ user }) => {
  return (
    <div>
      <header className="header">
        <h1 className="title">My Portal</h1>
      </header>
      <div className="card">
        <h2>Welcome, {user.name}!</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          This is your personal employee portal. Future features like Leave Requests, Payslips, and Expense tracking will be available here soon.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <div className="glass-card" style={{ flex: 1, padding: '1.5rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)' }}>
            <h3>My Details</h3>
            <p style={{ marginTop: '0.5rem' }}>Role: {user.role}</p>
            <p>Username: {user.username}</p>
          </div>
          <div className="glass-card" style={{ flex: 1, padding: '1.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}>
            <h3>Quick Links</h3>
            <p style={{ marginTop: '0.5rem' }}>- View Payslip (Coming Soon)</p>
            <p>- Request Leave (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
