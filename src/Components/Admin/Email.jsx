import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';

export default function Email() {
  const [emails, setEmails] = useState([]);
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSentEmails = async () => {
   
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/sentEmails'); 
      setEmails(response.data);
      setShowModal(true); 
    } catch (err) {
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
fetchRepliedEmails()

  },[])

  const fetchRepliedEmails = async () => {

    try {
      const repliesResponse = await axiosInstance.get(`/repliedEmails`);
      setReplies(repliesResponse.data);

      
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className='container'>
      <button className='btn btn-primary mb-3' onClick={fetchSentEmails}>
        Sent Emails
      </button>

<h5>Replies:</h5>
                <ul className="list-group mt-3">
                  {replies.length > 0 ? (
                    replies.map((reply, index) => (
                      <li key={index} className="list-group-item">
                        <strong>Reply from {reply.email}:</strong>
                        <p>{reply.message}</p>
                      </li>
                    ))
                  ) : (
                    <p>No replies found for this admin.</p>
                  )}
                </ul>
      

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sent Emails</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {loading && <p>Loading emails...</p>}
                {error && <p className="text-danger">{error}</p>}
                <ul className="list-group">
                  {emails.length > 0 ? (
                    emails.map((email, index) => (
                      <li key={index} className="list-group-item">
                        <strong>{email.email}</strong> {/* Title as Email */}
                        <p>Subject : {email.subject}</p>
                        <p>Message : {email.message}</p>
                      </li>
                    ))
                  ) : (
                    <p>No sent emails found.</p>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Background Overlay */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
