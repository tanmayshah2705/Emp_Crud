import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const AttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empAttendance, setEmpAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/attendance`);
      setRecords(res.data);
    } catch (err) { console.error(err); }
  };

  const handleRowClick = async (r) => {
    setSelectedEmp(r);
    try {
      const res = await axios.get(`${API_BASE}/attendance/employee/${r.employeeId}`);
      const formatted = res.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(a => ({
          date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          hours: a.totalHours || 0
        }));
      setEmpAttendance(formatted);
      setShowModal(true);
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click on a row to view employee attendance trends</p>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id} className="fade-in" style={{ cursor: 'pointer' }}>
                <td>{i + 1}</td>
                <td>{r.employeeName || r.employeeId}</td>
                <td>{r.date}</td>
                <td>{r.clockIn || '—'}</td>
                <td>{r.clockOut || '—'}</td>
                <td>{r.totalHours != null ? `${r.totalHours} hrs` : '—'}</td>
                <td>{getStatusBadge(r.status)}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleRowClick(r)}>📊 View Trends</button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No attendance records yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Attendance Trends: {selectedEmp?.employeeName}</h2>
              <button className="btn btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div className="card glass-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Working Hours History</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={empAttendance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
