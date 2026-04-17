import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const UserProfile = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
        if (!storedUserId) {
            alert("User not found. Please log in.");
            navigate("/login");
            return;
        }

        fetch(`${API_BASE_URL}/api/users/${storedUserId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                    navigate("/login");
                } else {
                    setUser({ name: data.name, email: data.email, password: "" });
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                alert("Failed to load user details.");
                setLoading(false);
            });
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUserId = localStorage.getItem("user_id");

        if (!storedUserId) {
            alert("User ID not found. Please log in again.");
            return;
        }

        const updatedUser = { name: user.name };
        if (user.password.trim() !== "") {
            updatedUser.password = user.password;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/update/${storedUserId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            alert(data.message || "Profile updated successfully!");
            setIsEditing(false);
            setUser({ ...user, password: "" });
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.message);
        }
    };

    if (loading) return <p>Loading user details...</p>;

    return (
        <div className="container mt-4">
            <h2>Profile</h2>
            <div className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        value={user.name} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={user.email} 
                        disabled 
                    />
                </div>

                {isEditing && (
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            value={user.password} 
                            onChange={handleChange} 
                            placeholder="Enter new password (optional)" 
                        />
                    </div>
                )}

                {!isEditing ? (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
