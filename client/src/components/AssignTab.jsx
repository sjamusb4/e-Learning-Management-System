import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AssignTab({ modules, students, setLoading }) {
  const [studentId, setStudentId] = useState("");
  const [moduleId, setModuleId] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const handleAssign = async () => {
    if (!studentId || !moduleId) {
      return toast.error("Select Module & Student!");
    }
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/api/enrollment/enroll`,
        { moduleId, studentId },
        { headers: { token } },
      );

      toast.success("Assigned successfully!");
    } catch {
      toast.error("Assignment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h3 className="font-bold mb-4">Assign Course</h3>

      <select
        onChange={(e) => setStudentId(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      >
        <option>Select Student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setModuleId(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      >
        <option>Select Module</option>
        {modules.map((m) => (
          <option key={m.module_id} value={m.module_id}>
            {m.module_title}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Assign
      </button>
    </div>
  );
}
