import { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status] = useState("pending");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role_id = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      fetch(`${API_BASE_URL}/api/get_tasks?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }

    if (user_id && role_id) {
      fetch(
        `${API_BASE_URL}/api/users/non-admins?user_id=${user_id}&role_id=${role_id}`
      )
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, []);

  const handleTaskCreation = async (e) => {
    const user_id = localStorage.getItem("user_id");
    const role_id = localStorage.getItem('role_id');
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", "pending");
    formData.append("user_id", user_id);
    formData.append("deadline", deadline);
    formData.append("priority", priority);
    formData.append("users", JSON.stringify(selectedUsers));
    if (file) {
      formData.append("attachment", file);
    }
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
    //   headers: { "Content-Type": "application/json" },
      body: formData,
    });

    if (response.ok) {
      alert("Task Created!");
      // onAddTask(newTask);
      setFile(null);
      setSelectedUsers([]);
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("medium");
    } else {
      alert("Failed to create task. Try again!");
    }
  };

  const handleTaskAssignment = async (e) => {
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
    navigate("/dashboard");
  };

  return (
    <div className="container mt-4">
      <h2>Task Management</h2>

      {/* Task Creation Form */}
      <form className="card p-4 shadow-sm mb-4" onSubmit={handleTaskCreation}>
        <h4>Create Task</h4>
        <div className="mb-3">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            className="form-control"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Attach File</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
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
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
