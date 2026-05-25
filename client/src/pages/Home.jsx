import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // ✅ Auto redirect if logged in
  if (token) {
    if (role === "Student") navigate("/student-dashboard");
    if (role === "Mentor") navigate("/mentor-dashboard");
    if (role === "Admin") navigate("/admin-dashboard");
  }

  return (
    <div className="bg-gray-50">
      {/* ✅ HERO SECTION */}
      <div className="bg-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          E-Learning Management System
        </h1>
        <p className="text-lg mb-8">
          Learn smarter. Teach better. Track progress easily.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-indigo-600 px-6 py-2 rounded font-medium hover:bg-gray-100"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-500 px-6 py-2 rounded font-medium hover:bg-indigo-400"
          >
            Register
          </button>
        </div>
      </div>

      {/* ✅ FEATURES */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold text-lg mb-2">📚 Learn Courses</h3>
          <p className="text-gray-600">
            Students can explore structured modules and track their progress.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold text-lg mb-2">🎯 Assign Easily</h3>
          <p className="text-gray-600">
            Mentors can create modules and assign them to students.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold text-lg mb-2">📊 Track Progress</h3>
          <p className="text-gray-600">
            Admins monitor performance and manage users efficiently.
          </p>
        </div>
      </div>

      {/* ✅ ROLES */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">👨‍🎓 Student</h3>
            <p className="text-gray-600">
              Access lessons, complete modules, and track your learning journey.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">👨‍🏫 Mentor</h3>
            <p className="text-gray-600">
              Build courses, create lessons, and guide students.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-bold text-xl mb-2">🛠 Admin</h3>
            <p className="text-gray-600">
              Manage users, modules, and system operations.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ CTA */}
      <div className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Start your learning journey today 🚀
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-600 px-6 py-2 rounded font-medium hover:bg-gray-100"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
``;
