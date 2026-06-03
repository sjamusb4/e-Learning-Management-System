import axios from "axios";
import { toast } from "react-toastify";

export default function ModulesTab({
  modules,
  setModules,
  setLoading,
  loading,
}) {
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

      setModules((prev) =>
        prev.map((m) =>
          m.module_id === id
            ? {
                ...m,
                is_active: !m.is_active,
              }
            : m,
        ),
      );

      toast.success("Module updated!");
    } catch {
      toast.error("Failed!");
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
            <th className="p-3 w-16">Sr.No.</th>
            <th className="p-3">Title</th>
            <th className="p-3">Created by</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((m, i) => (
            <tr key={m.module_id} className="border-b">
              {/* Added Serial Number Column */}
              <td className="p-3 text-gray-500 font-medium">{i + 1}</td>

              {/* Safe fallback string protection */}
              <td className="p-3">{m.title || m.module_title}</td>
              <td className="p-3">{m.creator_name || "Admin"}</td>

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
                {/* Button disables on loading to block spam clicks */}
                <button
                  onClick={() => toggleModule(m.module_id)}
                  disabled={loading}
                  className={`px-3 py-1 rounded transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
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
