import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";

export default function EmpDetail({
  fetchUsers,
  setRenderUser,
  renderUser,
  setUser,
  setIsUpdating,
  setUpdatingUserId,
  setShowRegisterForm,
  setEmployeeDetail,
  setCalendar,
}) {
  useEffect(() => {
    fetchUsers();
  }, []);






  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

 

  const handleOpenModal = (email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubject("");
    setMessage("");
  };





  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(`/deleteUser/${id}`);
      alert("User deleted successfully!");

      
      setRenderUser(renderUser.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleUpdateUser = (user) => {
    setUser({
      name: user.name,
      contact: user.contact,
      email: user.email,
      password: "",
      domain: user.domain,
      employeeId: user.employeeId,
    });
    setIsUpdating(true);
    setUpdatingUserId(user._id);
    setShowRegisterForm(true);
    setEmployeeDetail(false);
    setCalendar(false);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/sendEmail", {
        email: selectedEmail,
        subject,
        message,
      });
      alert(response.data.message);
      handleCloseModal();
    } catch (error) {
      console.error("Error sending email:", error.response ? error.response.data : error);
      alert("Failed to send email");
    }
  };
  
  return (
    <div className="container w-75">
      <table className="table table-responsive table-bordered border-primary">
        <thead className="table-dark">
          <tr>
            <td>Name</td>
            <td>Contact</td>
            <td>Email</td>
            <td>Domain</td>
            <td>Employee Id</td>
            <td>Edit</td>
          </tr>
        </thead>
        <tbody>
          {renderUser.length > 0 ? (
            renderUser.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.contact}</td>
                <td>{user.email} <button className="btn btn-secondary" onClick={() => handleOpenModal(user.email)}><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td>{user.domain}</td>
                <td>{user.employeeId}</td>
                <td>
                  <button
                    className="btn btn-primary me-1"
                    onClick={() => handleUpdateUser(user)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger me-1"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
           
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found</td>
            </tr>
          )}
        </tbody>
      </table>


      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Email</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSendEmail}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedEmail}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">
                    Send Email
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
