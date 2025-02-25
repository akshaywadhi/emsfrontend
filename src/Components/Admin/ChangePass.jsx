import axios from 'axios'
import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

export default function ChangePass() {


  const [oldPass , setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [showPassOld, setShowPassOld] = useState(false)
  const [showPassNew, setShowPassNew] = useState(false)
  const [error, setError] = useState('')




  const handleChangePass = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); 
     
      if (!token) {
        setError("You are not authenticated. Please log in.");
        return;
      }
      const res = await axiosInstance.put('/changePass', {
        oldPass,newPass
      },)

      alert(res.data.message)
      setNewPass('')
      setOldPass('')
      setError('')
    } catch (error) {
    setError(error.response.data.message)
    }
  }


  return (
    <div className="container-fluid">
    <div className="container">
      <div className="card mt-4">
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <h4 className="card-title text-center">Change Password</h4>
          <form className="form row gy-2 w-50" onSubmit={handleChangePass}>
            <label className="col-form-label">Enter Old Password</label>
            <div className='input-group'>
            <input
              type={showPassOld ? 'text' : 'password'}
              name='oldPass'
              className="form-control"
              value={oldPass}
             onChange={(e) => setOldPass(e.target.value)}
              required
            />
             <span
      className="input-group-text"
      onClick={() => setShowPassOld(!showPassOld)}
      style={{ cursor: "pointer" }}
    >
   {showPassOld ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}  
    </span>
          
            </div>
              <label className="col-form-label">Enter New Password</label>
              <div className='input-group'>
              <input
              type={showPassNew ? 'text' : 'password'}
              name="newPass"
              className="form-control"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              
              required
            />
             <span
      className="input-group-text"
    onClick={() => setShowPassNew(!showPassNew)}
      style={{ cursor: "pointer" }}
    >
   {showPassNew ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>} 
    </span>
              </div>

         {error && <div className="alert alert-danger">{error}</div>} 
            <button className="btn btn-danger w-50 mx-auto mt-2">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}
