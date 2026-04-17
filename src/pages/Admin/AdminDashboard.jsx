import React, { useEffect, useState } from "react";
import API_BASE_URL from '../../config';
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.log(error);
    }
    
  };

  if (!dashboardData) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Dashboard Summary Cards */}
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-lg text-white bg-primary text-center p-3">
            <h5 className="card-title"><i className="bi bi-people-fill"></i> Total Users</h5>
            <p className="display-6 fw-bold">{dashboardData.total_users}</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-lg text-white bg-success text-center p-3">
            <h5 className="card-title"><i className="bi bi-person-badge-fill"></i> Total Managers</h5>
            <p className="display-6 fw-bold">{dashboardData.total_managers}</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-lg text-white bg-warning text-center p-3">
            <h5 className="card-title"><i className="bi bi-list-task"></i> Active Tasks</h5>
            <p className="display-6 fw-bold">{dashboardData.active_tasks}</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-lg text-white bg-danger text-center p-3">
            <h5 className="card-title"><i className="bi bi-exclamation-triangle-fill"></i> High Priority</h5>
            <p className="display-6 fw-bold">{dashboardData.high_priority_tasks}</p>
          </div>
        </div>
      </div>

      {/* Task Status Cards */}
      <div className="row g-4 mt-3">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card shadow border-primary text-center p-3">
            <h5 className="text-primary"><i className="bi bi-hourglass-split"></i> Pending Tasks</h5>
            <p className="display-6 fw-bold text-primary">{dashboardData.pending_tasks}</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="card shadow border-warning text-center p-3">
            <h5 className="text-warning"><i className="bi bi-tools"></i> In Progress</h5>
            <p className="display-6 fw-bold text-warning">{dashboardData.in_progress_tasks}</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow border-success text-center p-3">
            <h5 className="text-success"><i className="bi bi-check-circle-fill"></i> Completed</h5>
            <p className="display-6 fw-bold text-success">{dashboardData.completed_tasks}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity
      <div className="card shadow mt-4">
        <div className="card-header bg-dark text-white"><i className="bi bi-clock-history"></i> Recent Activity</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {dashboardData.recent_activities.length > 0 ? (
              dashboardData.recent_activities.map((activity, index) => (
                <li key={index} className="list-group-item">
                  <i className={`bi ${getIcon(activity.activity_type)}`}></i> {activity.details}
                  <span className="text-muted float-end">{formatTime(activity.created_at)}</span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No recent activity</li>
            )}
          </ul>
        </div>
      </div> */}
    </div>
  );
};

// Function to get icons based on activity type
const getIcon = (type) => {
  switch (type) {
    case "user_registered": return "bi-person-plus-fill text-success";
    case "task_completed": return "bi-check-circle text-primary";
    case "task_overdue": return "bi-exclamation-triangle text-warning";
    case "task_assigned": return "bi-people-fill text-info";
    default: return "bi-info-circle";
  }
};

// Function to format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export default AdminDashboard;