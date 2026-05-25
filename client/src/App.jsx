import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";

import StudentDashboard from "./pages/StudentDashboard";
import ModuleDetail from "./components/ModuleDetail";
import LessonDetail from "./components/LessonDetail";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDahboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {!["/login", "/register"].includes(location.pathname) && <Navbar />}{" "}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ✅ Default */}
        <Route path="/" element={<Home />} />

        {/* ✅ Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ✅ Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard/module/:moduleId"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <ModuleDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard/module/:moduleId/lesson/:lessonId"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <LessonDetail />
            </ProtectedRoute>
          }
        />

        {/* ✅ Mentor */}
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
