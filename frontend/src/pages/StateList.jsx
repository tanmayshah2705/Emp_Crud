import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/states';

const StateList = () => {
  const [states, setStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { fetchStates(); }, []);

  const fetchStates = async () => {
    const res = await axios.get(API_URL);
    setStates(res.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEdit) await axios.put(`${API_URL}/${formData.code}`, formData);
    else await axios.post(API_URL, formData);
    setIsModalOpen(false);
    fetchStates();
  };

  const handleDelete = async (code) => {
    if (window.confirm('Delete this state?')) {
      await axios.delete(`${API_URL}/${code}`);
      fetchStates();
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">States</h1>
        <button className="btn btn-primary" onClick={() => { setFormData({ code: '', name: '' }); setIsEdit(false); setIsModalOpen(true); }}>
          + Add State
        </button>
      </header>
      <div className="card">
        <table className="table-container">
          <thead><tr><th>S.No</th><th>Code</th><th>Name</th><th>Actions</th></tr></thead>
          <tbody>
            {states.map((s, i) => (
              <tr key={s.code}>
                <td>{i + 1}</td>
                <td>{s.code}</td>
                <td>{s.name}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => { setFormData(s); setIsEdit(true); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s.code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEdit ? 'Edit State' : 'Add State'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" className="form-control" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={isEdit} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateList;
