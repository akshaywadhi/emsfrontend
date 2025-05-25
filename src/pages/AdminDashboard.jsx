import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
