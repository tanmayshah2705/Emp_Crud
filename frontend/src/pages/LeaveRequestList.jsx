import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const LeaveRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leave-requests`);
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAction = async (id, action) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.put(`${API_BASE}/leave-requests/${id}/${action}`, { approvedBy: user?.name || 'Admin' });
      fetchRequests();
    } catch (err) { console.error(err); }
  };

  const filteredRequests = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

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
        <h1 className="title">Leave Requests</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </header>
      <div className="card">
        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r, i) => (
              <tr key={r.id} className="fade-in">
                <td>{i + 1}</td>
                <td>{r.employeeName}</td>
                <td>{r.leaveType}</td>
                <td>{r.startDate}</td>
                <td>{r.endDate}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                <td>{getStatusBadge(r.status)}</td>
                <td>
                  {r.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ color: '#10b981', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleAction(r.id, 'approve')}>✓ Approve</button>
                      <button className="btn btn-outline" style={{ color: '#ef4444', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleAction(r.id, 'reject')}>✕ Reject</button>
                    </div>
                  )}
                  {r.status !== 'PENDING' && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>By {r.approvedBy}</span>}
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No leave requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestList;
