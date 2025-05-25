import { useEffect, useState } from "react";
import api from "@/api";

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/employee/attendance");
        if (response.data.success) {
          setAttendance(response.data.attendance);
          // Check if today's attendance is already marked
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayRecord = response.data.attendance.find(
            (record) => new Date(record.date).getTime() === today.getTime()
          );
          if (todayRecord) {
            setTodayStatus(todayRecord.status);
          }
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleMarkAttendance = async () => {
    try {
      const response = await api.post("/employee/attendance/mark");
      if (response.data.success) {
        setTodayStatus("present");
        setSuccess("Attendance marked successfully");
        // Refresh attendance list
        const attendanceResponse = await api.get("/employee/attendance");
        if (attendanceResponse.data.success) {
          setAttendance(attendanceResponse.data.attendance);
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      // If attendance is already marked, treat it as a success
      if (error.response?.status === 400) {
        setTodayStatus("present");
        setSuccess("Attendance already marked for today");
        // Refresh attendance list to ensure UI is in sync
        const attendanceResponse = await api.get("/employee/attendance");
        if (attendanceResponse.data.success) {
          setAttendance(attendanceResponse.data.attendance);
        }
      } else {
        setError(error.response?.data?.message || "Failed to mark attendance");
      }
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
          {!todayStatus && (
            <button
              onClick={handleMarkAttendance}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Mark Attendance
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Today's Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Today&apos;s Status
          </h2>
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                todayStatus === "present"
                  ? "bg-green-100 text-green-800"
                  : todayStatus === "absent"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {todayStatus ? todayStatus.toUpperCase() : "Not Marked"}
            </span>
          </div>
        </div>

        {/* Attendance History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.length > 0 ? (
                  attendance.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.time).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
