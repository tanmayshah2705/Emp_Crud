import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/students';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'M',
    dateOfBirth: '',
    familyIncome: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setFormData(student);
    } else {
      setCurrentStudent(null);
      setFormData({
        name: '',
        gender: 'M',
        dateOfBirth: '',
        familyIncome: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStudent) {
        await axios.put(`${API_URL}/${currentStudent.rollNumber}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchStudents();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Students</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Student</button>
      </header>

      <div className="card">
        <table className="table-container">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Family Income</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.rollNumber}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.gender === 'M' ? 'Male' : 'Female'}</td>
                <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                <td>₹{student.familyIncome.toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => handleOpenModal(student)}>Edit</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(student.rollNumber)}>Delete</button>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{currentStudent ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label>
                    <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleInputChange} /> Male
                  </label>
                  <label>
                    <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleInputChange} /> Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Family Income</label>
                <input
                  type="number"
                  name="familyIncome"
                  className="form-control"
                  value={formData.familyIncome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
