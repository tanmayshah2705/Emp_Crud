import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AuthService from '../services/AuthService';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await AuthService.login({ username: formData.username, password: formData.password });
        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data));
          onLogin(response.data);
          navigate('/');
        }
      } else {
        await AuthService.signup(formData);
        alert('Signup successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg-main)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" className="form-control" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control" onChange={handleInputChange} required defaultValue="EMPLOYEE">
                  <option value="SUPER_ADMIN">Admin</option>
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="form-control" onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" onChange={handleInputChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
