import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    if (!formData.email || !formData.password) {
      setErrors({
        email: "Email is required",
        password: "Password is required",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/handle_login`,
        formData
      );

      const { token, role, user_id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      if (role === 1) navigate("/admin/dashboard");
      else if (role === 3) navigate("/manager/dashboard");
      else navigate("/user/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded">
            <h3 className="text-center mb-4">Login</h3>
            {serverError && <p className="alert alert-danger">{serverError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100">
                <i className="bi bi-box-arrow-in-right"></i> Login
              </button>

              <p className="mt-3 text-center">
                <i className="bi bi-pencil-square"></i> Don't have an account?{" "}
                <Link to="/signup">Sign Up</Link>
              </p>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
