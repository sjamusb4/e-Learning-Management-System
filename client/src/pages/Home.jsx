import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // Auto redirect if logged in
  if (token) {
    if (role === "Student") navigate("/student-dashboard");
    if (role === "Mentor") navigate("/mentor-dashboard");
    if (role === "Admin") navigate("/admin-dashboard");
  }

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <div className="bg-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          E-Learning Management System
        </h1>
        <p className="text-lg mb-8">
          Learn smarter. Teach better. Track progress easily.
        </p>

        <div className="flex justify-center gap-4"></div>
      </div>
    </div>
  );
}
``;
