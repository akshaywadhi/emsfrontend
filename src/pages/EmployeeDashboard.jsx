import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="p-8">
      <Outlet />
    </div>
  );
};

export default EmployeeDashboard;
