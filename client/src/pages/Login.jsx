import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginForm from "../components/LoginForm";
import Loader from "../utils/Loader";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${apiUrl}/api/user/login`, {
        email,
        password,
      });
      console.log(result);

      const { token, user_role, user_id, username } = result.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user_role);
      localStorage.setItem("userId", user_id);
      localStorage.setItem("username", username);

      setUser({ username, user_role });

      toast.success("Login successful!");

      if (user_role === "Mentor") {
        navigate("/mentor-dashboard");
      } else if (user_role === "Student") {
        navigate("/student-dashboard");
      } else if (user_role == "Admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {/* loader */}
      {loading && <Loader />}

      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 dark:bg-gray-200 p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold">
          Sign in to your account
        </h2>

        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
