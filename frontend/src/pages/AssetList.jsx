import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null, assetType: 'LAPTOP', serialNumber: '', assignedTo: '', assignedName: '', warrantyExpiry: '', assetCondition: 'NEW'
  });

  useEffect(() => { fetchAssets(); }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/assets`);
      setAssets(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API_BASE}/assets/${formData.id}`, formData);
      } else {
        await axios.post(`${API_BASE}/assets`, formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchAssets();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (asset) => {
    setFormData(asset);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset?')) {
      await axios.delete(`${API_BASE}/assets/${id}`);
      fetchAssets();
    }
  };

  const resetForm = () => {
    setFormData({ id: null, assetType: 'LAPTOP', serialNumber: '', assignedTo: '', assignedName: '', warrantyExpiry: '', assetCondition: 'NEW' });
    setIsEdit(false);
  };

  const getConditionBadge = (condition) => {
    const styles = {
      NEW: { background: '#10b98122', color: '#10b981' },
      GOOD: { background: '#6366f122', color: '#6366f1' },
      FAIR: { background: '#f59e0b22', color: '#f59e0b' },
      DAMAGED: { background: '#ef444422', color: '#ef4444' },
    };
    return <span style={{ ...styles[condition], padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{condition}</span>;
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Company Assets</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>+ Add Asset</button>
      </header>
      <div className="card">
        <table className="table-container">
          <thead>
            <tr><th>S.No</th><th>Type</th><th>Serial No.</th><th>Assigned To</th><th>Warranty Expiry</th><th>Condition</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={a.id} className="fade-in">
                <td>{i + 1}</td>
                <td>{a.assetType}</td>
                <td style={{ fontFamily: 'monospace' }}>{a.serialNumber}</td>
                <td>{a.assignedName || a.assignedTo || '—'}</td>
                <td>{a.warrantyExpiry || '—'}</td>
                <td>{getConditionBadge(a.assetCondition)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)', fontSize: '0.8rem' }} onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {assets.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No assets registered</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit Asset' : 'Add Asset'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Asset Type</label>
                  <select className="form-control" value={formData.assetType} onChange={(e) => setFormData({ ...formData, assetType: e.target.value })} required>
                    <option value="LAPTOP">Laptop</option>
                    <option value="MONITOR">Monitor</option>
                    <option value="PHONE">Phone</option>
                    <option value="KEYCARD">Keycard</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input type="text" className="form-control" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Assigned To (Employee ID)</label>
                  <input type="text" className="form-control" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Employee Name</label>
                  <input type="text" className="form-control" value={formData.assignedName} onChange={(e) => setFormData({ ...formData, assignedName: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Warranty Expiry</label>
                  <input type="date" className="form-control" value={formData.warrantyExpiry || ''} onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select className="form-control" value={formData.assetCondition} onChange={(e) => setFormData({ ...formData, assetCondition: e.target.value })} required>
                    <option value="NEW">New</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="DAMAGED">Damaged</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
