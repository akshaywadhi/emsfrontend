import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import MainLayout from "./components/ui/MainLayout";

// Admin Components
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import Reports from "./components/reports/Reports";

// Employee Components
import EmployeeSummary from "./components/dashboard/EmployeeSummary";
import EmployeeProfile from "./components/employee/EmployeeProfile";
import EmployeeAttendance from "./components/employee/EmployeeAttendance";
import EmployeeLeaves from "./components/employee/EmployeeLeaves";
import EmployeePayslips from "./components/employee/EmployeePayslips";
import EmployeeList from "./components/employee/EmployeeList";
import AttendanceList from "./components/attendance/AttendanceList";
import LeaveList from "./components/leave/LeaveList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <MainLayout />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceList />} />
          <Route path="reports" element={<Reports />} />
          <Route path="leaves" element={<LeaveList />} />
        </Route>

        {/* Employee Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <MainLayout>
                <EmployeeDashboard />
              </MainLayout>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="leaves" element={<EmployeeLeaves />} />
          <Route path="payslips" element={<EmployeePayslips />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
