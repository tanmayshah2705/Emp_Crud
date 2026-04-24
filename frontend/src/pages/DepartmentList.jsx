import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/departments';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deptCode: null, name: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    const res = await axios.get(API_URL);
    setDepartments(res.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEdit) await axios.put(`${API_URL}/${formData.deptCode}`, formData);
    else await axios.post(API_URL, formData);
    setIsModalOpen(false);
    fetchDepartments();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchDepartments();
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Departments</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="form-control" 
            style={{ width: '250px', marginBottom: 0 }}
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              if (term === '') {
                fetchDepartments();
              } else {
                setDepartments(departments.filter(d => d.name.toLowerCase().includes(term)));
              }
            }}
          />
          <button className="btn btn-outline" onClick={() => window.open(`${API_URL}/export/pdf`, '_blank')}>
            📄 Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => { setFormData({ deptCode: null, name: '' }); setIsEdit(false); setIsModalOpen(true); }}>
            + Add Department
          </button>
        </div>
      </header>
      <div className="card">
        <table className="table-container">
          <thead><tr><th>S.No</th><th>Dept Code</th><th>Name</th><th>Actions</th></tr></thead>
          <tbody>
            {departments.map((d, i) => (
              <tr key={d.deptCode}>
                <td>{i + 1}</td>
                <td>{d.deptCode}</td>
                <td>{d.name}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => { setFormData(d); setIsEdit(true); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(d.deptCode)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEdit ? 'Edit Department' : 'Add Department'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Department Name</label>
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

export default DepartmentList;
