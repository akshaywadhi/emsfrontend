import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./AdminPanel.css";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import CalendarMeet from "./Admin/CalendarMeet";
import EmpDetail from "./Admin/EmpDetail";
import { FolderViewerAdmin } from "./Admin/FolderView";
import Email from "./Admin/Email";
import ChangePass from "./Admin/ChangePass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [email, setEmail] = useState(false);

  const fileInputRef = useRef(null)

  const [user, setUser] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    domain: "",
    employeeId: "",
    resumeUrl: "",
  });
  const [file, setFile] = useState(null);
  const [renderUser, setRenderUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") {
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/");
      }
    }

    //gettting Users

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
  
    try {
      const response = await axiosInstance.get("/users"); // Fetch users from backend
      setRenderUser(response.data); // Store users in state
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file); 
    formData.append("upload_preset", "tars_files_upload");
    formData.append("resource_type", "raw");
    

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dh6dwf1n6/raw/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload file.");
      return null;
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setEmployeeDetail(false);
    setCalendar(false);
    setShowDoc(false);
    setShowPass(false);
    setEmail(false);
  };

  const handleEmail = () => {
    setShowRegisterForm(false);
    setEmployeeDetail(false);
    setCalendar(false);
    setShowDoc(false);
    setShowPass(false);
    setEmail(true);
  };

  const handleEmployeeDetailClick = () => {
    setShowRegisterForm(false);
    setEmployeeDetail(true);
    setCalendar(false);
    setShowDoc(false);
    setShowPass(false);
    setEmail(false);
  };

  const handleChangePass = () => {
    setShowRegisterForm(false);
    setEmployeeDetail(false);
    setCalendar(false);
    setShowDoc(false);
    setShowPass(true);
    setEmail(false);
  };

  const handleCalendar = () => {
    setEmployeeDetail(false);
    setShowRegisterForm(false);
    setCalendar(true);
    setShowDoc(false);
    setShowPass(false);
    setEmail(false);
  };

  const handleShowDoc = () => {
    setEmployeeDetail(false);
    setShowRegisterForm(false);
    setCalendar(false);
    setShowDoc(true);
    setShowPass(false);
    setEmail(false);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.info('Loading...')
      const resumeUrl = await uploadToCloudinary(); 
      if (!resumeUrl){
        setIsLoading(false)
        return;
      }  

      const userData = { ...user, resumeUrl }; 

      if (isUpdating) {
        // Update User
        await axiosInstance.put(`/updateUser/${updatingUserId}`, userData);
        alert("User updated successfully!");
        setUpdatingUserId(null);
      } else {
        await axiosInstance.post("/addUser", userData);
        alert("User registered successfully!");
      }

      setUser({
        name: "",
        contact: "",
        email: "",
        password: "",
        domain: "",
        employeeId: "",
        resumeUrl: "",
      });
      setIsUpdating(false);
      setUpdatingUserId(null);
      setFile(null);
      fileInputRef.current.value = ''
      fetchUsers();
    } catch (error) {
      console.error("Error:", error.response || error);
      alert(
        `Error: ${error.response?.data?.message || "Failed to process request"}`
      )
    }finally {
      setIsLoading(false); 
    }
  };

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
            <a href="">Akshay Wadhi</a>
             
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
            <a className="sidebar-link" onClick={handleRegisterClick}>
              <i className="fa-solid fa-pen"></i>
              <span>
                {updatingUserId !== null
                  ? "Update Employee"
                  : "Register Employee"}
              </span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              className="sidebar-link collapsed has-dropdown"
              onClick={handleEmployeeDetailClick}
            >
              <i className="fa-regular fa-user"></i>
              <span>Employee Details</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              className="sidebar-link collapsed has-dropdown"
              onClick={handleEmail}
            >
              <i class="fa-regular fa-envelope"></i>
              <span>Email</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleCalendar}>
              <i className="fa-regular fa-calendar"></i>
              <span>Calendar</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              className="sidebar-link collapsed has-dropdown"
              onClick={handleChangePass}
            >
              <i class="fa-solid fa-lock-open"></i>
              <span>Change Password</span>
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
        <div className="d-flex justify-content-center align-items-center">
          <h1>Employee Management System</h1>
        </div>

        {showDoc && <FolderViewerAdmin/>}

        {/* Show Register Employee Form */}
        {showRegisterForm && (
          <div className="register-form p-3 border rounded shadow z-3">
            <h3>
              <span>
                {updatingUserId !== null
                  ? "Update Employee"
                  : "Register Employee"}
              </span>
            </h3>
            <ToastContainer autoClose={2000}/>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact"
                  value={user.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  disabled={updatingUserId !== null}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Resume</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Domain</label>
                <input
                  type="text"
                  className="form-control"
                  name="domain"
                  value={user.domain}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Employee Id</label>
                <input
                  type="text"
                  className="form-control"
                  name="employeeId"
                  value={user.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {updatingUserId !== null ? "Update" : "Submit"}
              </button>
            </form>{" "}
          </div>
        )}

        {/*Email*/}
        {email && <Email />}

        {/* Show Employee Details */}
        {employeeDetail && (
          <EmpDetail
            fetchUsers={fetchUsers}
            renderUser={renderUser}
            setRenderUser={setRenderUser}
            setUser={setUser}
            setIsUpdating={setIsUpdating}
            setUpdatingUserId={setUpdatingUserId}
            setShowRegisterForm={setShowRegisterForm}
            setEmployeeDetail={setEmployeeDetail}
            setCalendar={setCalendar}
          />
        )}

        {/* Show Calendar */}
        {calendar && <CalendarMeet />}

        {/* change pass */}

        {showPass && <ChangePass />}
      </div>
    </div>
  );
}
