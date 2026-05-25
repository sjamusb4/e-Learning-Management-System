export default function ProgressTab({ students }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3">Student</th>
            <th className="p-3">Completed</th>
            <th className="p-3">Progress</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-3 font-medium">{s.name}</td>

              <td className="p-3">
                {s.completed}/{s.total}
              </td>

              <td className="p-3">
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{
                      width:
                        s.total === 0
                          ? "0%"
                          : `${(s.completed / s.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
