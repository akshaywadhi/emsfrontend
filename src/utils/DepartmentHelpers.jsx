import { useNavigate } from 'react-router-dom';

export const columns = [
    {
        name: "SNo.",
        selector: (row) => row.sno,
        sortable: true
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true
    },
    {
        name: "Action",
        selector: (row) => row.action,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true
    }
];

export const DepartmentButtons = ({ ID }) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-2">
            <button 
                onClick={() => navigate(`/admin-dashboard/department/${ID}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
            </button>
        </div>
    );
};
