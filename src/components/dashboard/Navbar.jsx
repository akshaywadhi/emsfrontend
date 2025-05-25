import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center h-[88px] px-6 bg-white border-b border-gray-200">
      <p className="text-2xl font-bold text-gray-800">
        Welcome, {user?.firstName} {user?.lastName}
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300 shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
