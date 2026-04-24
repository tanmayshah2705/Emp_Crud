import React, { useState, useEffect } from 'react';
import * as EmployeeService from '../services/EmployeeService';

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <button className="btn btn-outline" onClick={() => window.open('http://localhost:8080/api/employees/export/pdf', '_blank')}>
            📄 Export PDF
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
                    <button className="btn btn-outline" onClick={() => handleOpenModal(emp)}>Edit</button>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(emp.empId)}>Delete</button>
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
