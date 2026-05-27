import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import Loader from "../utils/Loader";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setuserRole] = useState("Student");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${apiUrl}/api/user/register`, {
        username,
        email,
        password,
        role: userRole,
      });

      toast.success("Registration successful!");

      // ✅ optional: auto redirect to login
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {/* ✅ Transparent Loader Overlay (optional) */}
      {loading && <Loader />}

      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 dark:bg-gray-200 p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold">Create your account</h2>

        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          userRole={userRole}
          setuserRole={setuserRole}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
