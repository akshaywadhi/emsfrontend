import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function Email() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(""); 

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axiosInstance.get("/user/getEmails");
        console.log("Fetched Emails:", response.data);
        setEmails(response.data);
      } catch (error) {
        console.error("Error fetching emails:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      
      const payload = {
        replyMessage,
        userEmail: selectedEmail, 
      };

     
      await axiosInstance.post("/user/replyAdmin", payload);

      alert("Reply sent to admin successfully!");
      setReplyMessage(""); 
      setSelectedEmail(""); 
    } catch (error) {
      console.error("Error sending reply:", error.response?.data || error);
      alert("Failed to send reply.");
    }
  };

  return (
    <div className="container">
      <h2>Your Emails</h2>
      {loading ? (
        <p>Loading emails...</p>
      ) : emails.length > 0 ? (
        <ul className="list-group">
          {emails.map((email) => (
            <li key={email._id} className="list-group-item mb-4">
              <strong>Subject:</strong> {email.subject} <br />
              <strong>Message:</strong> {email.message}
              <button
                className="btn btn-warning text-white ms-2"
                data-bs-toggle="modal"
                data-bs-target="#replyModal"
                onClick={() => setSelectedEmail(email.email)} 
              >
                Reply
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails found.</p>
      )}

      {/* Reply Modal */}
      <div
        className="modal fade"
        id="replyModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reply to Admin</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <label>Reply From:</label>
              <input
                type="email"
                className="form-control mb-3"
                value={selectedEmail}
                disabled
              />
              <textarea
                className="form-control"
                placeholder="Enter your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleReply}
                data-bs-dismiss="modal"
              >
                Send Reply
              </button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
