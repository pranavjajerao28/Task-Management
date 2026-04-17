import { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import { useLocation, useNavigate } from "react-router-dom";

const TaskAssignForm = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  

  useEffect(() => {
    // Fetch all tasks for dropdown
    fetch(`${API_BASE_URL}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));

    // Fetch only users where role_id != 1 (excluding Admins)
    fetch(`${API_BASE_URL}/api/users/non-admins`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/tasks/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: selectedTask,
        assigned_by: 3,
        users: selectedUsers,
      }),
    });

    alert("Task Assigned!");
    navigate('*/dashboard');
  };

  return (
    <div className="container mt-4">
      <h2>Assign Task</h2>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Task</label>
          <select
            className="form-select"
            onChange={(e) => setSelectedTask(e.target.value)}
            required
          >
            <option value="">Choose Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Assign to Users</label>
          <select
            className="form-select"
            multiple
            onChange={(e) =>
              setSelectedUsers(
                [...e.target.selectedOptions].map((option) => option.value)
              )
            }
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          <small className="text-muted">
            Hold CTRL (Windows) or CMD (Mac) to select multiple users.
          </small>
        </div>

        <button type="submit" className="btn btn-success">
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default TaskAssignForm;
