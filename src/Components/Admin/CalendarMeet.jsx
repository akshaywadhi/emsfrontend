import React, { useState } from "react";
import Calendar from "react-calendar";
import axiosInstance from "../../utils/axiosInstance";
import './Calendar.css';


export default function CalendarMeet() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMeetingPurpose("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/meeting", {
        date: selectedDate,
        purpose: meetingPurpose,
      });
    
      alert(`Meeting on: ${response.data.date}`);
      console.log(`Purpose: ${response.data.purpose}`);
      handleModalClose();
    } catch (error) {
      console.error("Error saving meeting:", error);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center h-100">
        <Calendar onChange={handleDateChange} />
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Meeting</h5>
                <button
                  type="button"
                  className="btn close"
                  aria-label="Close"
                  onClick={handleModalClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="formDate">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      id="formDate"
                      readOnly
                      value={selectedDate ? selectedDate.toDateString() : ""}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formPurpose">Meeting Purpose</label>
                    <input
                      type="text"
                      className="form-control"
                      id="formPurpose"
                      placeholder="Enter meeting purpose"
                      value={meetingPurpose}
                      onChange={(e) => setMeetingPurpose(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
