import axios from "axios";
import { toast } from "react-toastify";

export default function UsersTab({ users, setUsers, setLoading }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const deleteUser = async (id) => {
    const confirmDelete = confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(`${apiUrl}/api/user/${id}`, {
        headers: { token },
      });

      setUsers((prev) => prev.filter((u) => u.user_id !== id));

      toast.success("User deleted!");
    } catch {
      toast.error("Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <h2 className="p-4 font-bold border-b">User Management</h2>

      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-b">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>

              <td className="p-3">
                <button
                  onClick={() => deleteUser(u.user_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
