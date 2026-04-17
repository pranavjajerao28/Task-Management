import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import AdminNavbar from "./components/AdminNavbar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerNavbar from "./components/ManagerNavbar";
import UserNavbar from "./components/UserNavbar";
import UserDashboard from "./pages/User/UserDashboard";
// import TaskPage from "./pages/Admin/AdminTask";
import Footer from "./components/Footer";
import ManageUser from "./pages/Admin/ManageUser";
// import ManageUserManager from "./pages/Manager/ManageUserManager";
import ManagerDashboard from "./pages/Manager/ManagrerDashboard";
// import TaskDetails from "./pages/Manager/TaskDetails";
import TaskForm from "./pages/TaskForm";
import TaskAssignForm from "./pages/TaskAssignForm";
import Logout from "./pages/Logout";
import TaskList from "./pages/Admin/TaskList";
import UserProfile from "./UserProfile";


const ManagerLayout = () => (
  <>
    <ManagerNavbar />
    <Routes>
      <Route path="dashboard" element={<ManagerDashboard />} />
      {/* <Route path="/tasks/:id" element={<TaskDetails />} /> */}
      {/* <Route path="manage-users" element={<ManageUserManager/>}/> */}
      <Route path="create-tasks" element={<TaskForm />} />
      <Route path="assign-task" element={<TaskAssignForm />} />
      <Route path="profile" element={<UserProfile/>}/>
    </Routes>
  </>
);
const UserLayout = () => (
  <>
    <UserNavbar />
    <Routes>
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="create-tasks" element={<TaskForm />} />
      <Route path="profile" element={<UserProfile/>}/>
    </Routes>
  </>
);
const AdminLayout = () => (
  <>
    <AdminNavbar />
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="tasks" element={<TaskList />} />
      <Route path="manage-users" element={<ManageUser />} />
      {/* <Route path="create-tasks" element={<TaskForm />} /> */}
      <Route path="assign-task" element={<TaskAssignForm />} /> 
      <Route path="profile" element={<UserProfile/>}/>  
    </Routes>
  </>
);

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/manager/*" element={<ManagerLayout />} />
              <Route path="/user/*" element={<UserLayout />} />
              <Route path="logout" element={<Logout/>}/>
            </Routes>
          </div>
        </Router>
      </main>
      <Footer />
    </div>
  );
};

export default App;
