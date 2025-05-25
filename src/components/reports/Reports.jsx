import { useState } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart2, Download } from "lucide-react";
import { format } from "date-fns";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerateReport = async (type) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (type === "department") {
        response = await api.get("/employee/reports/department");
      } else {
        response = await api.get(`/employee/reports/${type}`, {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        });
      }

      if (response.data.success) {
        // Generate CSV content
        let csvContent = "";
        let filename = "";

        switch (type) {
          case "attendance":
            csvContent = generateAttendanceCSV(response.data.report);
            filename = `attendance_report_${selectedYear}_${selectedMonth}.csv`;
            break;
          case "leave":
            csvContent = generateLeaveCSV(response.data.report);
            filename = `leave_report_${selectedYear}_${selectedMonth}.csv`;
            break;
          case "department":
            csvContent = generateDepartmentCSV(response.data.report);
            filename = "department_report.csv";
            break;
        }

        // Download CSV
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceCSV = (report) => {
    const header = [
      "Employee Name",
      "Email",
      "Department",
      "Present Days",
      "Absent Days",
      "Late Days",
      "Total Days",
      "Attendance Rate",
    ];
    const rows = report.map((record) => [
      `${record.employee.firstName} ${record.employee.lastName}`,
      record.employee.email,
      record.employee.department?.name || "N/A",
      record.present,
      record.absent,
      record.late,
      record.total,
      `${((record.present / record.total) * 100).toFixed(2)}%`,
    ]);
    return [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
  };

  const generateLeaveCSV = (report) => {
    const header = [
      "Employee Name",
      "Email",
      "Department",
      "Approved Leaves",
      "Pending Leaves",
      "Rejected Leaves",
      "Total Leaves",
    ];
    const rows = report.map((record) => [
      `${record.employee.firstName} ${record.employee.lastName}`,
      record.employee.email,
      record.employee.department?.name || "N/A",
      record.approved,
      record.pending,
      record.rejected,
      record.total,
    ]);
    return [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
  };

  const generateDepartmentCSV = (report) => {
    const header = ["Department", "Total Employees", "Positions"];
    const rows = report.map((record) => [
      record.department,
      record.total,
      Object.entries(record.positions)
        .map(([pos, count]) => `${pos}: ${count}`)
        .join(", "),
    ]);
    return [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
  };

  return (
    <div className="py-8 px-2 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="mb-6 flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {format(new Date(2000, i), "MMMM")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Attendance Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart2 className="h-5 w-5" />
                  Attendance Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Generate monthly attendance reports for all employees
                </p>
                <Button
                  className="w-full"
                  onClick={() => handleGenerateReport("attendance")}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            {/* Leave Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart2 className="h-5 w-5" />
                  Leave Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Generate leave reports showing employee leave history
                </p>
                <Button
                  className="w-full"
                  onClick={() => handleGenerateReport("leave")}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            {/* Department Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart2 className="h-5 w-5" />
                  Department Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Generate department-wise employee distribution reports
                </p>
                <Button
                  className="w-full"
                  onClick={() => handleGenerateReport("department")}
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
