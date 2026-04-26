import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const EmployeeDashboard = ({ user }) => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    fetchTodayAttendance();
    fetchMyLeaves();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance/today/${user.employeeId || user.username}`);
      if (res.data.clocked !== false) setTodayAttendance(res.data);
      else setTodayAttendance(null);
    } catch (err) { console.error(err); }
  };

  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leave-requests/employee/${user.employeeId || user.username}`);
      setLeaveRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleClockIn = async () => {
    try {
      await axios.post(`${API_BASE}/attendance/clock-in`, {
        employeeId: user.employeeId || user.username,
        employeeName: user.name
      });
      fetchTodayAttendance();
    } catch (err) { alert(err.response?.data?.message || 'Error clocking in'); }
  };

  const handleClockOut = async () => {
    try {
      await axios.post(`${API_BASE}/attendance/clock-out`, {
        employeeId: user.employeeId || user.username
      });
      fetchTodayAttendance();
    } catch (err) { alert(err.response?.data?.message || 'Error clocking out'); }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/leave-requests`, {
        ...leaveForm,
        employeeId: user.employeeId || user.username,
        employeeName: user.name
      });
      setIsLeaveModalOpen(false);
      setLeaveForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      fetchMyLeaves();
    } catch (err) { console.error(err); }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: { background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b44' },
      APPROVED: { background: '#10b98122', color: '#10b981', border: '1px solid #10b98144' },
      REJECTED: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' },
    };
    return <span style={{ ...styles[status], padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{status}</span>;
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">My Portal</h1>
      </header>

      {/* Welcome + Attendance Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '5px solid #6366f1' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Welcome, {user.name}!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Role: {user.role}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ID: {user.employeeId || user.username}</p>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
          <h3 style={{ marginBottom: '1rem' }}>⏰ Today's Attendance</h3>
          {!todayAttendance ? (
            <button className="btn btn-primary" onClick={handleClockIn}>🟢 Clock In</button>
          ) : !todayAttendance.clockOut ? (
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Clocked in at: <strong>{todayAttendance.clockIn}</strong></p>
              <button className="btn btn-outline" style={{ color: '#ef4444' }} onClick={handleClockOut}>🔴 Clock Out</button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)' }}>In: <strong>{todayAttendance.clockIn}</strong> → Out: <strong>{todayAttendance.clockOut}</strong></p>
              <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem' }}>Total: {todayAttendance.totalHours} hrs</p>
            </div>
          )}
        </div>
      </div>

      {/* Leave Requests Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>📋 My Leave Requests</h3>
          <button className="btn btn-primary" onClick={() => setIsLeaveModalOpen(true)}>+ Request Leave</button>
        </div>
        <table className="table-container">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((r) => (
              <tr key={r.id} className="fade-in">
                <td>{r.leaveType}</td>
                <td>{r.startDate}</td>
                <td>{r.endDate}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                <td>{getStatusBadge(r.status)}</td>
              </tr>
            ))}
            {leaveRequests.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No leave requests yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>Request Leave</h2>
            <form onSubmit={handleLeaveSubmit}>
              <div className="form-group">
                <label>Leave Type</label>
                <select className="form-control" value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })} required>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PTO">Paid Time Off</option>
                  <option value="MATERNITY">Maternity Leave</option>
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" className="form-control" value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" className="form-control" value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea className="form-control" rows="3" value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} required
                  style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsLeaveModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
