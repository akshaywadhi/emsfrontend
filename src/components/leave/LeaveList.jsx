import { useState, useEffect, useCallback } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/context/authContext";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [dataIssues, setDataIssues] = useState([]);
  const { user } = useAuth();

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/employee/leaves/all", {
        params: { status: status !== "all" ? status : undefined },
      });
      if (response.data.success) {
        console.log("Leaves data received:", response.data.leaves);
        // Check for leaves without employee data
        const invalidLeaves = response.data.leaves.filter(leave => !leave.employee);
        if (invalidLeaves.length > 0) {
          console.warn("Found leaves without employee data:", invalidLeaves);
          setDataIssues(invalidLeaves);
        } else {
          setDataIssues([]);
        }
        setLeaves(response.data.leaves);
      } else {
        setError("Failed to load leave requests");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const response = await api.put(`/employee/leaves/${leaveId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        console.log(response.data)
        setSuccess("Leave status updated successfully");
        fetchLeaves(); // Refresh the list
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave status");
    }
  };

  const handleCleanup = async () => {
    try {
      setLoading(true);
      const response = await api.delete("/employee/leaves/cleanup");
      if (response.data.success) {
        setSuccess(`Cleaned up ${response.data.deletedCount} orphaned leave records`);
        setDataIssues([]);
        fetchLeaves(); // Refresh the list
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clean up orphaned records");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    // Skip leaves without valid employee data
    if (!leave.employee || !leave.employee.firstName) {
      console.warn("Skipping leave without employee data:", leave);
      return false;
    }
    
    // Additional safety checks
    if (!leave.type || !leave.reason) {
      console.warn("Skipping leave with missing required fields:", leave);
      return false;
    }
    
    const searchStr = [
      leave.employee.firstName || "",
      leave.employee.lastName || "",
      leave.employee.email || "",
      leave.type || "",
      leave.reason || "",
    ]
      .join(" ")
      .toLowerCase();
    return searchStr.includes(search.toLowerCase());
  });

  return (
    <div className="py-8 px-2 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {dataIssues.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="font-semibold">⚠️ Data Integrity Warning</p>
              <p className="text-sm">
                Found {dataIssues.length} leave record(s) with missing employee data. 
                These records will not be displayed. Contact an administrator to clean up the database.
              </p>
              {user?.role === "admin" && (
                <div className="mt-2">
                  <Button
                    onClick={handleCleanup}
                    disabled={loading}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                  >
                    {loading ? "Cleaning..." : "Clean Up Orphaned Records"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or reason"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Leave Requests List */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : filteredLeaves.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No leave requests found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeaves.map((leave) => {
                // Additional safety check for employee data
                if (!leave.employee || !leave.employee.firstName) {
                  return (
                    <Card
                      key={leave._id}
                      className="hover:shadow-md transition-shadow border-red-200"
                    >
                      <CardContent className="p-6">
                        <div className="text-red-600">
                          <p className="font-semibold">Invalid Leave Record</p>
                          <p className="text-sm">Employee data is missing for this leave request.</p>
                          <p className="text-xs">Leave ID: {leave._id}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
                
                return (
                  <Card
                    key={leave._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {leave.employee.firstName} {leave.employee.lastName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              ({leave.employee.email})
                            </span>
                          </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {leave.type ? (leave.type.charAt(0).toUpperCase() + leave.type.slice(1)) : "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Period:</span>{" "}
                            {leave.startDate && leave.endDate 
                              ? `${format(new Date(leave.startDate), "MMM d, yyyy")} - ${format(new Date(leave.endDate), "MMM d, yyyy")}`
                              : "N/A"
                            }
                          </p>
                          <p>
                            <span className="font-medium">Reason:</span>{" "}
                            {leave.reason || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(leave.status || "pending").toUpperCase()}
                        </span>
                        {(!leave.status || leave.status === "pending") && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(leave._id, "approved")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleStatusChange(leave._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveList;
