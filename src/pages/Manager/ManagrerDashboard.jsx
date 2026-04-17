import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import TaskForm from "../TaskForm";

const ManagerDashboard = () => {
  const user_id = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({});
  const [comment, setComment] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchComments = async (taskId) => {
    if (!taskId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/get_comments?task_id=${taskId}`
      );
      const data = await response.json();
      return data; // Returns comments for a specific task
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/manager_task?user_id=${user_id}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const tasksWithComments = await Promise.all(
          data.map(async (task) => {
            const comments = await fetchComments(task.id);
            return { ...task, comments };
          })
        );
        setTasks(tasksWithComments);
      } else {
        setTasks([]); // No tasks assigned
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addComment = async () => {
    if (comment.trim() === "" || !selectedTask) return;

    const user_id = localStorage.getItem("user_id"); // Fetch user_id from localStorage

    if (!user_id) {
      console.error("User ID not found in localStorage");
      return;
    }

    const newComment = {
      text: comment,
      user_id, // Sending user_id
      task_id: selectedTask.id, // Sending task_id
    };

    console.log("Sending comment data:", newComment); // Debugging log

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      const data = await response.json();
      console.log("Server response:", data); // Log server response

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id
              ? {
                  ...task,
                  comments: [
                    ...(task.comments || []),
                    { ...newComment, id: data.comment_id },
                  ],
                }
              : task
          )
        );
        setComment(""); // Clear input field
      } else {
        console.error("Error response from server:", data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mt-3">
      {showModal ? (
        <TaskForm onClose={() => setShowModal(false)} />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Task Management</h4>
            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle"></i> Add Task
            </button>
          </div>

          <div className="row">
            {/* Task List Section */}
            <div
              className="col-md-4 border-end px-0 bg-light"
              style={{ height: "80vh", overflowY: "auto" }}
            >
              <h5 className="p-3 bg-success text-white">Tasks</h5>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border-bottom d-flex justify-content-between align-items-center ${
                      selectedTask?.id === task.id
                        ? "bg-primary text-white"
                        : "bg-white"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      console.log("Selected Task:", task);
                      setSelectedTask(task);
                    }}
                  >
                    <div>
                      <strong>{task.title}</strong>
                      <p className="mb-0 text-muted small">{task.priority}</p>
                    </div>
                    <span
                      className={`badge bg-${
                        task.priority === "High"
                          ? "danger"
                          : task.priority === "Medium"
                          ? "warning"
                          : "success"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-3 text-center text-muted">No tasks assigned</p>
              )}
            </div>

            {/* Task Details Section */}
            <div className="col-md-8">
              {selectedTask ? (
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5>{selectedTask.title}</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Description:</strong> {selectedTask.description}
                    </p>
                    <p>
                      <strong>Priority:</strong>
                      <span
                        className={`badge bg-${
                          selectedTask.priority === "High"
                            ? "danger"
                            : selectedTask.priority === "Medium"
                            ? "warning"
                            : "success"
                        }`}
                      >
                        {selectedTask.priority}
                      </span>
                    </p>

                    {/* Attachments Section */}
                    {selectedTask.attachments &&
                    selectedTask.attachments.length > 0 ? (
                      <div className="mb-3">
                        <h6>Attachments</h6>
                        <ul className="list-group">
                          {selectedTask.attachments.map((attachment, index) => (
                            <li key={index} className="list-group-item">
                              <a
                                href={`${API_BASE_URL+attachment.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                {attachment.file_url.split("/").pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted">No attachments available.</p>
                    )}

                    {/* Comments Section */}
                    <h6>Comments</h6>
                    <ul className="list-group mb-3">
                      {selectedTask.comments.length > 0 ? (
                        selectedTask.comments.map((c, index) => (
                          <li key={index} className="list-group-item mt-2">
                            <strong>{c.user_name}:</strong> {c.comment}{" "}
                            <span className="text-muted">
                              (
                              {new Date(c.created_at).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                              )
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">
                          No comments yet.
                        </li>
                      )}
                    </ul>

                    {/* Add Comment */}
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button className="btn btn-success" onClick={addComment}>
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="p-3 text-center text-muted">
                  Select a task to view details
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
