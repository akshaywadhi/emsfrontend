import { useState, useEffect } from "react";
import api from "@/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeSummary = () => {
  const [stats, setStats] = useState({
    profile: {
      firstName: "",
      lastName: "",
      position: "",
    },
    attendance: {
      present: 0,
      absent: 0,
      late: 0,
    },
    leaves: {
      total: 0,
      used: 0,
      remaining: 0,
    },
    documents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        // Fetch employee profile
        const profileResponse = await api.get("/employee/profile");
        if (profileResponse.data.success) {
          setStats((prev) => ({
            ...prev,
            profile: profileResponse.data.employee,
          }));
        }

        // Fetch attendance stats
        const attendanceResponse = await api.get("/employee/attendance");
        if (attendanceResponse.data.success) {
          const attendance = attendanceResponse.data.attendance;
          const present = attendance.filter(
            (a) => a.status === "present"
          ).length;
          const absent = attendance.filter((a) => a.status === "absent").length;
          const late = attendance.filter((a) => a.status === "late").length;

          setStats((prev) => ({
            ...prev,
            attendance: { present, absent, late },
          }));
        }

        // Fetch leave balance
        const leaveResponse = await api.get("/employee/leaves");
        if (leaveResponse.data.success) {
          const leaves = leaveResponse.data.leaves;
          const used = leaves.filter((l) => l.status === "approved").length;
          const total = 20; // Assuming 20 days annual leave

          setStats((prev) => ({
            ...prev,
            leaves: {
              total,
              used,
              remaining: total - used,
            },
          }));
        }

        // Fetch documents/payslips for current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = currentDate.getFullYear();

        const documentsResponse = await api.get("/employee/payslips", {
          params: {
            month: currentMonth,
            year: currentYear,
          },
        });

        if (documentsResponse.data.success) {
          setStats((prev) => ({
            ...prev,
            documents: documentsResponse.data.payslips,
          }));
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(
          err.response?.data?.message || "Failed to fetch employee data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Profile</CardTitle>
          <User className="text-primary-600 dark:text-primary-400" size={32} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {`${stats.profile.firstName} ${stats.profile.lastName}`}
          </div>
          <CardDescription>{stats.profile.position}</CardDescription>
          <Button
            className="mt-4 w-full"
            variant="outline"
            size="sm"
            onClick={() => navigate("/employee-dashboard/profile")}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
          <Clock className="text-primary-600 dark:text-primary-400" size={32} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.attendance.present > 0
              ? Math.round(
                  (stats.attendance.present /
                    (stats.attendance.present + stats.attendance.absent)) *
                    100
                )
              : 0}
            %
          </div>
          <CardDescription>This Month</CardDescription>
          <Button
            className="mt-4 w-full"
            variant="outline"
            size="sm"
            onClick={() => navigate("/employee-dashboard/attendance")}
          >
            View History
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Leave Balance</CardTitle>
          <Calendar
            className="text-primary-600 dark:text-primary-400"
            size={32}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.leaves.remaining}</div>
          <CardDescription>Days Remaining</CardDescription>
          <Button
            className="mt-4 w-full"
            variant="outline"
            size="sm"
            onClick={() => navigate("/employee-dashboard/leaves")}
          >
            Apply Leave
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Documents</CardTitle>
          <FileText
            className="text-primary-600 dark:text-primary-400"
            size={32}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.documents?.length || 0}
          </div>
          <CardDescription>Active Documents</CardDescription>
          <Button
            className="mt-4 w-full"
            variant="outline"
            size="sm"
            onClick={() => navigate("/employee-dashboard/payslips")}
          >
            View All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSummary;
