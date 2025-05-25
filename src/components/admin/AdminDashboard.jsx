import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Building2,
  Calendar,
  ClipboardList,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const adminCards = [
  {
    to: "/admin-dashboard/employees",
    title: "Employee Management",
    description: "View and manage all employees in the organization.",
    icon: <Users className="h-9 w-9 text-primary-700" />,
  },
  {
    to: "/admin-dashboard/departments",
    title: "Department Management",
    description: "Organize and update department information.",
    icon: <Building2 className="h-9 w-9 text-primary-700" />,
  },
  {
    to: "/admin-dashboard/attendance",
    title: "Attendance Records",
    description: "Review and track employee attendance logs.",
    icon: <Calendar className="h-9 w-9 text-primary-700" />,
  },
  {
    to: "/admin-dashboard/leaves",
    title: "Leave Requests",
    description: "Approve or reject employee leave applications.",
    icon: <ClipboardList className="h-9 w-9 text-primary-700" />,
  },
  {
    to: "/admin-dashboard/reports",
    title: "Reports & Analytics",
    description: "Generate and download HR and payroll reports.",
    icon: <BarChart2 className="h-9 w-9 text-primary-700" />,
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="py-12 px-2 md:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-10 text-lg">
          Welcome! Use the panels below to manage employees, departments,
          attendance, leaves, and reports.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminCards.map((card) => (
            <button
              key={card.to}
              onClick={() => navigate(card.to)}
              className="group w-full text-left focus:outline-none"
              tabIndex={0}
              aria-label={card.title}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-lg group-focus:shadow-lg transition-all bg-white dark:bg-gray-800/90">
                <CardContent className="p-7 flex flex-col items-center gap-4 h-full">
                  <div className="rounded-lg bg-primary-50 dark:bg-primary-900/30 p-3 mb-2 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-1">
                    {card.title}
                  </CardTitle>
                  <p className="text-gray-500 dark:text-gray-300 text-center text-base mb-2">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
