// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/NavBar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import StudentDashboard from "./pages/StudentDashboard";
// import MentorDashboard from "./pages/MentorDashboard";

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar displays on every page */}
//       <Navbar />

//       {/* Route declarations */}
//       <Routes>
//         {/* Redirect homepage root to login page */}
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Role-specific routes */}
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
//         <Route path="/mentor-dashboard" element={<MentorDashboard />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Import your new dashboard ecosystem features
import StudentDashboard from "./pages/StudentDashboard";
import ModuleDetail from "./components/ModuleDetail";
import LessonDetail from "./components/LessonDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student Layout & Child Sub-routing links */}
        <Route
          path="/student-dashboard"
          element={
            // <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard/module/:moduleId"
          element={
            // <ProtectedRoute allowedRoles={["Student"]}>
            <ModuleDetail />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard/module/:moduleId/lesson/:lessonId"
          element={
            // <ProtectedRoute allowedRoles={["Student"]}>
            <LessonDetail />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
