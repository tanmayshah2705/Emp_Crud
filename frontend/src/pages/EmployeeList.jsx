import React, { useState, useEffect } from 'react';
import * as EmployeeService from '../services/EmployeeService';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    dateOfBirth: '',
    city: { code: '' },
    gender: 'M',
    salary: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const fileInputRef = React.useRef(null);

  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

  useEffect(() => {
    fetchEmployees();
    fetchCities();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeService.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await EmployeeService.getCities();
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData({
        ...employee,
        city: { code: employee.city?.code || '' }
      });
    } else {
      setCurrentEmployee(null);
      setFormData({
        empId: '',
        name: '',
        dateOfBirth: '',
        city: { code: '' },
        gender: 'M',
        salary: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenAttendanceModal = async (employee) => {
    setCurrentEmployee(employee);
    try {
      const response = await axios.get(`${API_BASE}/attendance/employee/${employee.empId}`);
      // Format data for chart: sort by date and map to { date, hours }
      const formatted = response.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(a => ({
          date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          hours: a.totalHours || 0,
          status: a.status
        }));
      setAttendanceData(formatted);
      setIsAttendanceModalOpen(true);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Could not fetch attendance data');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAttendanceModalOpen(false);
    setCurrentEmployee(null);
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
      if (currentEmployee) {
        await EmployeeService.updateEmployee(currentEmployee.empId, formData);
      } else {
        await EmployeeService.createEmployee(formData);
      }
      fetchEmployees();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await EmployeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await axios.post(`${API_BASE}/bulk/employees`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Success: ${response.data.success} employees uploaded. Errors: ${response.data.errors.length}`);
      fetchEmployees();
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Error uploading file: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Employees</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="form-control" 
            style={{ width: '250px', marginBottom: 0 }}
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              if (term === '') {
                fetchEmployees();
              } else {
                setEmployees(employees.filter(emp => emp.name.toLowerCase().includes(term)));
              }
            }}
          />
          <button className="btn btn-outline" onClick={() => window.open(`${API_BASE}/employees/export/pdf`, '_blank')}>
            📄 Export PDF
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".csv" 
            onChange={handleBulkUpload} 
          />
          <button 
            className="btn btn-outline" 
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
          >
            {isUploading ? '⌛ Uploading...' : '📁 Bulk CSV Upload'}
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Employee
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
              <th>DOB</th>
              <th>City</th>
              <th>Gender</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.empId}>
                <td>{index + 1}</td>
                <td>{emp.empId}</td>
                <td>{emp.name}</td>
                <td>{new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                <td>{emp.city?.name}</td>
                <td>{emp.gender === 'M' ? 'Male' : 'Female'}</td>
                <td>₹{emp.salary.toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => handleOpenAttendanceModal(emp)}>📊 Attendance</button>
                    <button className="btn btn-outline" onClick={() => handleOpenModal(emp)}>Edit</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(emp.empId)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Visual Modal */}
      {isAttendanceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Attendance Insights: {currentEmployee?.name}</h2>
              <button className="btn btn-icon" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              <div className="card" style={{ background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Summary</h3>
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Days Tracked</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{attendanceData.length}</p>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Avg. Hours/Day</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {(attendanceData.reduce((acc, curr) => acc + curr.hours, 0) / (attendanceData.length || 1)).toFixed(1)}h
                  </p>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Working Hours (Daily)</h3>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Log History</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="table-container" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.slice().reverse().map((a, i) => (
                      <tr key={i}>
                        <td>{a.date}</td>
                        <td>{a.hours}h</td>
                        <td>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '10px', 
                            fontSize: '0.7rem', 
                            background: a.status === 'PRESENT' ? '#dcfce7' : '#fee2e2',
                            color: a.status === 'PRESENT' ? '#166534' : '#991b1b'
                          }}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={handleCloseModal}>Close View</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="empId"
                  className="form-control"
                  value={formData.empId}
                  onChange={handleInputChange}
                  disabled={!!currentEmployee}
                  required
                />
              </div>
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
                <label>City</label>
                <select
                  name="cityCode"
                  className="form-control"
                  value={formData.city.code}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.code} value={city.code}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="M"
                      checked={formData.gender === 'M'}
                      onChange={handleInputChange}
                    /> Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={formData.gender === 'F'}
                      onChange={handleInputChange}
                    /> Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
