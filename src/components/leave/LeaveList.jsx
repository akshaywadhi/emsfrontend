import { useState, useEffect, useCallback } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/employee/leaves/all", {
        params: { status: status !== "all" ? status : undefined },
      });
      if (response.data.success) {
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
        fetchLeaves(); // Refresh the list
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave status");
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const searchStr = [
      leave.employee.firstName,
      leave.employee.lastName,
      leave.employee.email,
      leave.type,
      leave.reason,
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
              {filteredLeaves.map((leave) => (
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
                            {leave.type.charAt(0).toUpperCase() +
                              leave.type.slice(1)}
                          </p>
                          <p>
                            <span className="font-medium">Period:</span>{" "}
                            {format(new Date(leave.startDate), "MMM d, yyyy")} -{" "}
                            {format(new Date(leave.endDate), "MMM d, yyyy")}
                          </p>
                          <p>
                            <span className="font-medium">Reason:</span>{" "}
                            {leave.reason}
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
                          {leave.status.toUpperCase()}
                        </span>
                        {leave.status === "pending" && (
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveList;
