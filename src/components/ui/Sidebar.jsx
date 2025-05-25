import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import {
  Home,
  User,
  Users,
  Calendar,
  LogOut,
  BarChart2,
  Building2,
  FileText,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import logo from "../../assets/image.png";

const adminNavLinks = [
  { to: "/admin-dashboard", label: "Dashboard", icon: <Home size={20} /> },
  {
    to: "/admin-dashboard/departments",
    label: "Departments",
    icon: <Building2 size={20} />,
  },
  {
    to: "/admin-dashboard/employees",
    label: "Employees",
    icon: <Users size={20} />,
  },
  {
    to: "/admin-dashboard/attendance",
    label: "Attendance",
    icon: <Calendar size={20} />,
  },
  {
    to: "/admin-dashboard/leaves",
    label: "Leaves",
    icon: <FileText size={20} />,
  },
  {
    to: "/admin-dashboard/reports",
    label: "Reports",
    icon: <BarChart2 size={20} />,
  },
];

const employeeNavLinks = [
  { to: "/employee-dashboard", label: "Dashboard", icon: <Home size={20} /> },
  {
    to: "/employee-dashboard/profile",
    label: "Profile",
    icon: <User size={20} />,
  },
  {
    to: "/employee-dashboard/attendance",
    label: "Attendance",
    icon: <Calendar size={20} />,
  },
  {
    to: "/employee-dashboard/leaves",
    label: "Leaves",
    icon: <FileText size={20} />,
  },
  {
    to: "/employee-dashboard/payslips",
    label: "Payslips",
    icon: <BarChart2 size={20} />,
  },
];

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isEmployee } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If user is not authenticated, don't render the sidebar
  if (!user) {
    return null;
  }

  // Determine which navigation links to show based on user role
  const navLinks = isAdmin ? adminNavLinks : employeeNavLinks;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              EMS
            </span>
          </Link>
        </div>

        <div className="px-4 py-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-700 dark:text-primary-200">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          <NavigationMenu className="flex-1">
            <NavigationMenuList className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900/40 ${
                        location.pathname.startsWith(link.to)
                          ? "bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-200"
                          : ""
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem className="mt-auto">
                <NavigationMenuLink asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/40 w-full mt-8"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
