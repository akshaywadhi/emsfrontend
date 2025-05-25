import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const PAGE_SIZE = 10;

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/employee/attendance/all");
      if (response.data.success) {
        console.log(response.data)
        setAttendance(response.data.attendance);
      } else {
        setError("Failed to load attendance records");
      }
    } catch (error) {
      setError(
        error.response?.data.error || "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter((rec) => {
    const matchesText = [
      rec.employee?.firstName,
      rec.employee?.lastName,
      rec.employee?.email,
      rec.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const recDate = format(new Date(rec.date), "yyyy-MM-dd");
    const afterStart = !startDate || recDate >= startDate;
    const beforeEnd = !endDate || recDate <= endDate;
    return matchesText && afterStart && beforeEnd;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);
  const paginatedAttendance = filteredAttendance.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Export CSV
  const handleExportCSV = () => {
    const header = ["Employee", "Email", "Date", "Status", "Time"];
    const rows = filteredAttendance.map((rec) => [
      `${rec.employee?.firstName || ""} ${rec.employee?.lastName || ""}`.trim(),
      rec.employee?.email || "",
      format(new Date(rec.date), "yyyy-MM-dd"),
      rec.status,
      new Date(rec.time).toLocaleTimeString(),
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-2 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Attendance List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-2 border rounded"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-2 border rounded"
              />
              <Button variant="outline" onClick={handleExportCSV}>
                Export CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-400"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    paginatedAttendance.map((rec) => (
                      <tr
                        key={rec._id}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="px-4 py-3">
                          {rec.employee?.firstName} {rec.employee?.lastName}
                        </td>
                        <td className="px-4 py-3">{rec.employee?.email}</td>
                        <td className="px-4 py-3">
                          {new Date(rec.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 capitalize">{rec.status}</td>
                        <td className="px-4 py-3">
                          {new Date(rec.time).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceList;
