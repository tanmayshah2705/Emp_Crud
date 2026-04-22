import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getEmployees = () => axios.get(`${API_URL}/employees`);
export const getEmployeeById = (id) => axios.get(`${API_URL}/employees/${id}`);
export const createEmployee = (employee) => axios.post(`${API_URL}/employees`, employee);
export const updateEmployee = (id, employee) => axios.put(`${API_URL}/employees/${id}`, employee);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/employees/${id}`);

export const getCities = () => axios.get(`${API_URL}/cities`);
