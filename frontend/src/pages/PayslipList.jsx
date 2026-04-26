import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const PayslipList = () => {
  const [payslips, setPayslips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '', employeeName: '', month: '', year: new Date().getFullYear(),
    baseSalary: '', deductions: 0, bonus: 0
  });

  useEffect(() => { fetchPayslips(); }, []);

  const fetchPayslips = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payslips`);
      setPayslips(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/payslips`, formData);
      setIsModalOpen(false);
      setFormData({ employeeId: '', employeeName: '', month: '', year: new Date().getFullYear(), baseSalary: '', deductions: 0, bonus: 0 });
      fetchPayslips();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payslip?')) {
      await axios.delete(`${API_BASE}/payslips/${id}`);
      fetchPayslips();
    }
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div>
      <header className="header">
        <h1 className="title">Payslips</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Generate Payslip</button>
      </header>
      <div className="card">
        <table className="table-container">
          <thead>
            <tr><th>S.No</th><th>Employee</th><th>Month</th><th>Year</th><th>Base</th><th>Deductions</th><th>Bonus</th><th>Net Pay</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr key={p.id} className="fade-in">
                <td>{i + 1}</td>
                <td>{p.employeeName}</td>
                <td>{p.month}</td>
                <td>{p.year}</td>
                <td>₹{p.baseSalary?.toLocaleString()}</td>
                <td style={{ color: '#ef4444' }}>-₹{p.deductions?.toLocaleString()}</td>
                <td style={{ color: '#10b981' }}>+₹{p.bonus?.toLocaleString()}</td>
                <td style={{ fontWeight: 'bold' }}>₹{p.netPay?.toLocaleString()}</td>
                <td>
                  <button className="btn btn-outline" style={{ color: 'var(--danger)', fontSize: '0.8rem' }} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {payslips.length === 0 && <tr><td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No payslips generated yet</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>Generate Payslip</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" className="form-control" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Employee Name</label>
                  <input type="text" className="form-control" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Month</label>
                  <select className="form-control" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} required>
                    <option value="">Select Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" className="form-control" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Base Salary (₹)</label>
                  <input type="number" className="form-control" value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Deductions (₹)</label>
                  <input type="number" className="form-control" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Bonus (₹)</label>
                <input type="number" className="form-control" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipList;
