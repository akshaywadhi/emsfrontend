import React from 'react'
import logo from '../assets/manager.png'
import { useNavigate } from 'react-router-dom'
export default function Navbar() {
  const navigate = useNavigate()
  return (
    <div className="container-fluid">
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
       
        <h1 className="fw-bold">EMS</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          
            
                <li className="nav-item me-2 mb-2">
              <button className="btn btn-primary" onClick={() => navigate('/admin_login')}>
                    Admin
                  </button>  
                </li>
                <li className="nav-item">
                  <button className="btn btn-primary" onClick={() => navigate('/user_login')}>
                    User
                  </button>
                </li>
         

           
           
          </ul>
        </div>
      </div>
    </nav>
  </div>

    )
}
