import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // 1. If not logged in at all, boot back to login screen
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but doesn't match the specific role required for this page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect students out of mentor sections, and vice versa
    return (
      <Navigate
        to={userRole === "Mentor" ? "/mentor-dashboard" : "/student-dashboard"}
        replace
      />
    );
  }

  // 3. User is authorized, render the requested page component
  return children;
}
