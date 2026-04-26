import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const AuditLogList = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/audit-logs`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">System Audit Trails</h1>
      </header>
      <div className="card">
        <table className="table-container">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Entity</th>
              <th>ID</th>
              <th>Action</th>
              <th>Changed By</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="fade-in">
                <td style={{ fontSize: '0.8rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td><span className="badge">{log.entity}</span></td>
                <td>{log.entityId}</td>
                <td>
                  <span style={{ 
                    color: log.action === 'DELETE' ? 'var(--danger)' : log.action === 'CREATE' ? 'var(--success)' : 'var(--primary)',
                    fontWeight: 'bold'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>{log.changedBy}</td>
                <td style={{ maxWidth: '300px', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.newValue}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No audit logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogList;
