import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (token) {
    if (role === "Student") return <Navigate to="/student-dashboard" />;
    if (role === "Mentor") return <Navigate to="/mentor-dashboard" />;
    if (role === "Admin") return <Navigate to="/admin-dashboard" />;

    return <Navigate to="/" />;
  }

  return children;
}
