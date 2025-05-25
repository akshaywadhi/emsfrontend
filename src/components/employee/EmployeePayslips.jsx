import { useState, useEffect } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";

const EmployeePayslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const response = await api.get("/employee/payslips");
        if (response.data.success) {
          setPayslips(response.data.payslips);
        }
      } catch (error) {
        setError(error.response?.data.error || "Failed to fetch payslips");
      } finally {
        setLoading(false);
      }
    };
    fetchPayslips();
  }, []);

  const handleDownload = async (payslipId) => {
    try {
      const response = await api.get(
        `/employee/payslips/${payslipId}/download`,
        {
          responseType: "blob",
        }
      );

      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${selectedYear}_${selectedMonth}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.response?.data.error || "Failed to download payslip");
    }
  };

  return (
    <div className="py-8 px-2 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Payslips</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Month and Year Selection */}
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

          {/* Payslips List */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : payslips.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No payslips found for the selected period
            </div>
          ) : (
            <div className="space-y-4">
              {payslips.map((payslip) => (
                <Card
                  key={payslip._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-primary-600" />
                        <div>
                          <h3 className="font-semibold">
                            Payslip for{" "}
                            {format(new Date(payslip.date), "MMMM yyyy")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Generated on{" "}
                            {format(new Date(payslip.generatedAt), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{payslip.netSalary.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Net Salary</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(payslip._id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
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

export default EmployeePayslips;
