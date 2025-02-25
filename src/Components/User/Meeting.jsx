import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function Meeting() {
  const [meetingData, setMeetingData] = useState([]);

  useEffect(() => {
    fetchMeetingData();
  }, []);

  const fetchMeetingData = async () => {
    try {
      const response = await axiosInstance.get('/user/getAllMeetings');
      setMeetingData(response.data); // Store meeting details in state
    } catch (error) {
      console.error('Error fetching meeting data:', error);
      alert('Failed to fetch meeting data');
    }
  };

  const formatDate = (dateString) => {
    const date  = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="container w-75">
      <div className='text-center text-primary me-5'>
<h2>Meetings</h2>
      </div>
      <table className="table table-bordered border-primary">
        <thead className="table-dark">
          <tr>
            <td>Date</td>
            <td>Purpose</td>
          </tr>
        </thead>
        <tbody>
          {meetingData.length > 0 ? (
            meetingData.map((meeting) => (
              <tr key={meeting._id}>
                <td>{formatDate(meeting.date)}</td>
                <td>{meeting.purpose}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No meetings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
