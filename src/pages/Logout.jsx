import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");

    console.log("User logged out successfully!");

   
    navigate("/");
  }, [navigate]);

  return null;
};

export default Logout;
