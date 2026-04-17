import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const REACT_APP_API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
  
    if (!formData.name) {
      validationErrors.name = "Name is required";
    }
  
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
  
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
  
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Signup Successful!");
          navigate("/");
        } else {
          setErrors({ general: data.message });
          
        }
      } catch (error) {
        setErrors({ general: "Something went wrong. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded">
            <h3 className="text-center mb-4">Sign Up</h3>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label">Name:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password:</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Signing Up..." : <><i className="bi bi-person-plus-fill"></i> Sign Up</>}
              </button>

              <p className="mt-3 text-center">
                Already have an account? <Link to="/">Login</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;