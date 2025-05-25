import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

const PAGE_SIZE = 8;

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  position: "",
  role: "employee",
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employee");
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      setError(error.response?.data.error || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      setError(error.response?.data.error || "Failed to fetch departments");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employee/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
        setMessage("Employee deleted successfully");
      } catch (error) {
        setError(error.response?.data.error || "Failed to delete employee");
      }
    }
  };

  const openAddDialog = () => {
    setEditId(null);
    setForm(initialForm);
    setShowDialog(true);
  };

  const openEditDialog = (emp) => {
    setEditId(emp._id);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department?._id || "",
      position: emp.position || "",
      role: emp.role || "employee",
    });
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
       let data = await api.put(`/employee/${editId}`, form);
       console.log(data.data)
      } else {
        await api.post("/employee", form);
      }
      fetchEmployees();
      handleDialogClose();
    } catch (error) {
      setError(error.response?.data.error || "Failed to save employee");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    [emp.firstName, emp.lastName, emp.email, emp.position, emp.department?.name]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Export CSV
  const handleExportCSV = () => {
    const header = [
      "First Name",
      "Last Name",
      "Email",
      "Department",
      "Position",
      "Role",
    ];
    const rows = filteredEmployees.map((emp) => [
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.department?.name || "",
      emp.position || "",
      emp.role,
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-2 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search employees"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <div className="flex gap-2">
              <Button onClick={openAddDialog}>Add Employee</Button>
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
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => (
                      <tr
                        key={emp._id}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="px-4 py-3">
                          {emp.firstName} {emp.lastName}
                        </td>
                        <td className="px-4 py-3">{emp.email}</td>
                        <td className="px-4 py-3">
                          {emp.department?.name || "-"}
                        </td>
                        <td className="px-4 py-3">{emp.position || "-"}</td>
                        <td className="px-4 py-3 capitalize">{emp.role}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(emp)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(emp._id)}
                            >
                              Delete
                            </Button>
                          </div>
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

      {/* Add/Edit Employee Dialog */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit" : "Add"} Employee
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                  disabled={!!editId}
                />
                <div className="flex gap-2">
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                    required
                    className="w-1/2 px-3 py-2 border rounded"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={form.position}
                    onChange={handleFormChange}
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                </div>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editId ? "Update" : "Add"}</Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeList;
