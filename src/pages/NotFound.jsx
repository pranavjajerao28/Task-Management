import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center">
        <h1 className="display-1">
          <i className="bi bi-x-circle-fill" style={{ fontSize: "5rem" }}></i>
        </h1>
        <h2>Oops! Page Not Found</h2>
        <p className="lead">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door-fill"></i> Go to Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;
