import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js'; 
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Admin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admin_login', { name, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (error) {
      setError('Invalid admin credentials');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

const togglePass = () => {
  setShowPassword((prev) => !prev);
};

  return (
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="container">
        <div className="card mt-4">
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h4 className="card-title text-center">Admin Login</h4>
            <form className="form row gy-2 w-50 input-group" onSubmit={handleLogin}>
              <label className="col-form-label">Enter Your Name</label>
              <div className='input-group'>
              <input
                type="text"
                name="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              </div>
              
              <label className="col-form-label">Enter Your Password</label>
           <div className='input-group '>
           <input
                 type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
               <span
        className="input-group-text"
        onClick={togglePass}
        style={{ cursor: "pointer" }}
      >
        {showPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
      </span>
           </div>
              
              {error && <div className="alert alert-danger">{error}</div>}
              <button className="btn btn-danger w-50 mx-auto mt-2">Login</button>
            </form>
          </div>
          <p className='text-center'> For Testing Purpose Name Is 'admin' & Password Is '12345'</p>
        </div>
      </div>
    </div>
    </>
  );
}
