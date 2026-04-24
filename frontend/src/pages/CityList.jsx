import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', state: { code: '' } });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { fetchCities(); fetchStates(); }, []);

  const fetchCities = async () => {
    const res = await axios.get(`${API_BASE}/cities`);
    setCities(res.data);
  };

  const fetchStates = async () => {
    const res = await axios.get(`${API_BASE}/states`);
    setStates(res.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEdit) await axios.put(`${API_BASE}/cities/${formData.code}`, formData);
    else await axios.post(`${API_BASE}/cities`, formData);
    setIsModalOpen(false);
    fetchCities();
  };

  const handleDelete = async (code) => {
    if (window.confirm('Delete this city?')) {
      await axios.delete(`${API_BASE}/cities/${code}`);
      fetchCities();
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Cities</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="form-control" 
            style={{ width: '250px', marginBottom: 0 }}
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              if (term === '') {
                fetchCities();
              } else {
                setCities(cities.filter(c => c.name.toLowerCase().includes(term)));
              }
            }}
          />
          <button className="btn btn-outline" onClick={() => window.open(`${API_BASE}/cities/export/pdf`, '_blank')}>
            📄 Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setFormData({ code: '', name: '', state: { code: '' } }); setIsEdit(false); setIsModalOpen(true); }}>
            + Add City
          </button>
        </div>
      </header>
      <div className="card">
        <table className="table-container">
          <thead><tr><th>S.No</th><th>Code</th><th>Name</th><th>State</th><th>Actions</th></tr></thead>
          <tbody>
            {cities.map((c, i) => (
              <tr key={c.code}>
                <td>{i + 1}</td>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.state?.name}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => { setFormData({ ...c, state: { code: c.state?.code || '' } }); setIsEdit(true); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(c.code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEdit ? 'Edit City' : 'Add City'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" className="form-control" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={isEdit} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>State</label>
                <select className="form-control" value={formData.state.code} onChange={(e) => setFormData({ ...formData, state: { code: e.target.value } })} required>
                  <option value="">Select State</option>
                  {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
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

export default CityList;
