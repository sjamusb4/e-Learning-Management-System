import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    if (username && role) {
      setUser({ username, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Title */}
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-xl font-bold text-indigo-600 cursor-pointer"
            >
              E-Learning Management System
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm">
                  👤 {user.username} ({user.role})
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-700">
                👤 {user.username} ({user.role})
              </div>

              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 text-white text-left px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="block w-full text-left px-3 py-2"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="block w-full bg-indigo-600 text-white px-3 py-2 rounded-md"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
