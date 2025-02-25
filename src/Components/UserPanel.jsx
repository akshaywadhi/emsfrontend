import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserDetail from "./User/UserDetail";
import Meeting from "./User/Meeting";
import UserTask from "./User/UserTask";
import Email from "./User/Email";
import {FolderViewer} from "./User/Docs";

export default function UserPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showDoc, setShowDoc] = useState(false)

  const navigate = useNavigate();
  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); 
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "user") {
          navigate("/"); 
        }
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/"); 
      }
    }
  }, [navigate]);

  const handleEmployeeDetailClick = () => {
    setShowCalendar(false);
    setEmployeeDetail(true);
    setShowTask(false);
    setShowEmail(false);
    setShowDoc(false)
  };

  const handleShowCalendar = () => {
    setEmployeeDetail(false);
    setShowCalendar(true);
    setShowTask(false);
    setShowEmail(false);
    setShowDoc(false)
  };

  const handleShowTask = () => {
    setEmployeeDetail(false);
    setShowCalendar(false);
    setShowTask(true);
    setShowEmail(false);
    setShowDoc(false)
  };

  const handleShowEmail = () => {
    setEmployeeDetail(false);
    setShowCalendar(false);
    setShowTask(false);
    setShowEmail(true);
    setShowDoc(false)
  };

  const handleShowDoc = () => {
    setEmployeeDetail(false);
    setShowCalendar(false);
    setShowTask(false);
    setShowEmail(false);
    setShowDoc(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    <div className="wrapper d-flex">
      <aside id="sidebar" className={isExpanded ? "expand" : ""}>
        <div className="d-flex">
          <button
            className="toggle-btn"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <i className="lni lni-grid-alt"></i>
          </button>
          <div className="sidebar-logo">
            <a>Akshay Wadhi</a>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleShowDoc}>
              <i class="fa-regular fa-file"></i>
              <span>Documents</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a
              className="sidebar-link collapsed has-dropdown"
              onClick={handleEmployeeDetailClick}
            >
              <i class="fa-regular fa-user"></i>
              <span>Employee Details</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              className="sidebar-link collapsed has-dropdown"
              onClick={handleShowEmail}
            >
              <i class="fa-regular fa-envelope"></i>
              <span>Email Inbox</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleShowTask}>
              <i class="fa-solid fa-check"></i>
              <span>To-Do-List</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleShowCalendar}>
              <i class="fa-regular fa-calendar"></i>
              <span>Calendar</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a className="sidebar-link" onClick={handleLogout}>
            <i className="lni lni-exit"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>
      <div className="main p-3">
        <div className="text-center">
          <h1>Employee Management System</h1>
        </div>

        {/* Show Employee Details */}
        {employeeDetail && <UserDetail />}

        {showCalendar && <Meeting />}

        {showTask && <UserTask />}

        {showEmail && <Email />}

        {showDoc && <FolderViewer/>}
      </div>
    </div>
  );
}
