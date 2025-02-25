import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function UserDetail() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); 
      const response = await axiosInstance.get("/user/getUserDetail", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data); 
      setUserData(response.data); 
    } catch (error) {
      console.error("Error fetching user data:", error);
      console.log("Error Response:", error.response); 
      alert("Failed to fetch user data");
    }
  };

  return (
    <div className="container w-75">
      <div className='text-center text-primary me-5'>
<h2>Your Details</h2>
      </div>
      <table className="table table-bordered border-primary">
        <thead className="table-dark">
          <tr>
            <td>Name</td>
            <td>Contact</td>
            <td>Email</td>
            <td>Domain</td>
            <td>Employee Id</td>
          </tr>
        </thead>
        <tbody>
          {userData ? (
            <tr>
              <td>{userData.name}</td>
              <td>{userData.contact}</td>
              <td>{userData.email}</td>
              <td>{userData.domain}</td>
              <td>{userData.employeeId}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
