import axios from "axios";
import { toast } from "react-toastify";

export default function ModulesTab({ modules, setModules, setLoading }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const toggleModule = async (id) => {
    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/api/module/toggle/${id}`,
        {},
        { headers: { token } },
      );

      // ✅ Update UI instantly
      setModules((prev) =>
        prev.map((m) =>
          m.module_id === id
            ? {
                ...m,
                module_is_active: !m.module_is_active,
              }
            : m,
        ),
      );

      toast.success("Module updated ✅");
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 font-bold border-b">Module Management</h2>

      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Created by</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((m) => (
            <tr key={m.module_id} className="border-b">
              <td className="p-3">{m.title}</td>
              <td className="p-3">{m.creator_name}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    m.is_active
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {m.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="p-3">
                <button
                  onClick={() => toggleModule(m.module_id)}
                  className={`px-3 py-1 rounded ${
                    m.is_active
                      ? "bg-yellow-500 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {m.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
