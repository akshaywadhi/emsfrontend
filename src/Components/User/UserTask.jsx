import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../utils/axiosInstance";

export default function UserTask() {
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await axiosInstance.get("/user/tasks");

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error);
      alert(
        `Failed to fetch tasks: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  const handleShowModal = (task) => {
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskIdToUpdate(task._id);
      setIsUpdating(true);
    } else {
      setTaskTitle("");
      setTaskDescription("");
      setTaskIdToUpdate(null);
      setIsUpdating(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTaskTitle("");
    setTaskDescription("");
    setIsUpdating(false);
    setTaskIdToUpdate(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      if (isUpdating) {
        // Update task
        const response = await axiosInstance.put(
          `/user/tasks/${taskIdToUpdate}`,
          { title: taskTitle, description: taskDescription }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskIdToUpdate ? response.data : task
          )
        );
      } else {
        // Create new task
        const response = await axiosInstance.post("/user/tasks", {
          title: taskTitle,
          description: taskDescription,
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }

      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${isUpdating ? "updating" : "creating"} task:`,
        error
      );
      alert(`Failed to ${isUpdating ? "update" : "create"} task`);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      await axiosInstance.delete(`/user/tasks/${id}`);

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary mb-4"
        onClick={() => handleShowModal(null)}
      >
        Add Task
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdating ? "Update Task" : "Add Task"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="taskTitle">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="taskTitle"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea
                      className="form-control"
                      id="taskDescription"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">
                    {isUpdating ? "Update Task" : "Save Task"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="row">
        {tasks.length === 0 ? (
          <p className="text-center">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4"
              key={task._id}
            >
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description}</p>
                  <button
                    className="btn btn-primary mt-2 me-2"
                    onClick={() => handleShowModal(task)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
