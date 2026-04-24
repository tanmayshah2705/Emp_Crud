import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
const INTERN_URL = `${API_BASE}/interns`;
const CITY_URL = `${API_BASE}/cities`;

const InternList = () => {
  const [interns, setInterns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIntern, setCurrentIntern] = useState(null);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    city: { code: '' },
    gender: 'M',
    stipend: '',
    department: '',
    internshipPeriod: ''
  });

  useEffect(() => {
    fetchInterns();
    fetchCities();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axios.get(INTERN_URL);
      setInterns(response.data);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(CITY_URL);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleOpenModal = (intern = null) => {
    if (intern) {
      setCurrentIntern(intern);
      setFormData({
        ...intern,
        city: { code: intern.city?.code || '' }
      });
    } else {
      setCurrentIntern(null);
      setFormData({
        name: '',
        email: '',
        dateOfBirth: '',
        city: { code: '' },
        gender: 'M',
        stipend: '',
        department: '',
        internshipPeriod: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIntern(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cityCode') {
      setFormData({ ...formData, city: { code: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentIntern) {
        await axios.put(`${INTERN_URL}/${currentIntern.id}`, formData);
      } else {
        await axios.post(INTERN_URL, formData);
      }
      fetchInterns();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving intern:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this intern?')) {
      try {
        await axios.delete(`${INTERN_URL}/${id}`);
        fetchInterns();
      } catch (error) {
        console.error('Error deleting intern:', error);
      }
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Interns</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search interns..." 
            className="form-control" 
            style={{ width: '250px', marginBottom: 0 }}
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              if (term === '') {
                fetchInterns();
              } else {
                setInterns(interns.filter(i => i.name.toLowerCase().includes(term)));
              }
            }}
          />
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Intern
          </button>
        </div>
      </header>

      <div className="card">
        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>City</th>
              <th>Stipend</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern, index) => (
              <tr key={intern.id} className="fade-in">
                <td>{index + 1}</td>
                <td>{intern.id}</td>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.gender === 'M' ? 'Male' : 'Female'}</td>
                <td>{intern.city?.name || 'N/A'}</td>
                <td>₹{intern.stipend?.toLocaleString()}</td>
                <td>{intern.internshipPeriod}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => handleOpenModal(intern)}>Edit</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(intern.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>{currentIntern ? 'Edit Intern' : 'Add Intern'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select name="cityCode" className="form-control" value={formData.city.code} onChange={handleInputChange} required>
                    <option value="">Select City</option>
                    {cities.map(city => <option key={city.code} value={city.code}>{city.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Gender</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label><input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleInputChange} /> Male</label>
                    <label><input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleInputChange} /> Female</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Stipend</label>
                  <input type="number" name="stipend" className="form-control" value={formData.stipend} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" className="form-control" value={formData.department} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Internship Period</label>
                  <input type="text" name="internshipPeriod" className="form-control" placeholder="e.g. 6 Months" value={formData.internshipPeriod} onChange={handleInputChange} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Intern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternList;
