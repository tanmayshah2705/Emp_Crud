import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const AttendanceList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance`);
      setRecords(res.data);
    } catch (err) { console.error(err); }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PRESENT: { background: '#10b98122', color: '#10b981', border: '1px solid #10b98144' },
      ABSENT: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' },
      HALF_DAY: { background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b44' },
    };
    return <span style={{ ...styles[status], padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{status}</span>;
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Attendance Records</h1>
      </header>
      <div className="card">
        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Total Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id} className="fade-in">
                <td>{i + 1}</td>
                <td>{r.employeeName || r.employeeId}</td>
                <td>{r.date}</td>
                <td>{r.clockIn || '—'}</td>
                <td>{r.clockOut || '—'}</td>
                <td>{r.totalHours != null ? `${r.totalHours} hrs` : '—'}</td>
                <td>{getStatusBadge(r.status)}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No attendance records yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
