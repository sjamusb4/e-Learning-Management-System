import { useState } from "react";

export default function ProgressTab({ students }) {
  // Tracks which student row is expanded to show modules
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const toggleStudent = (id) => {
    setExpandedStudentId(expandedStudentId === id ? null : id);
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
          <tr>
            <th className="p-4 w-10"></th>
            <th className="p-4">Student</th>
            <th className="p-4 text-center">Modules Finished</th>
            <th className="p-4 text-center">Completed Lessons</th>
            <th className="p-4 w-1/4">Overall Lesson Progress</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {students.map((student) => {
            // Safe JSON string parsing fallback handler
            const modulesList =
              typeof student.modules === "string"
                ? JSON.parse(student.modules)
                : student.modules || [];

            const isExpanded = expandedStudentId === student.id;

            // Metrics tracking variables
            const totalModules = modulesList.length;
            const completedModules = modulesList.filter(
              (mod) => mod.is_module_completed,
            ).length;

            let totalLessonsAllModules = 0;
            let completedLessonsAllModules = 0;

            // Calculate aggregate lesson metrics
            modulesList.forEach((mod) => {
              totalLessonsAllModules += mod.total_lessons || 0;
              completedLessonsAllModules += mod.completed_lessons || 0;
            });

            // Prevent division-by-zero layout errors
            const overallProgressPercentage =
              totalLessonsAllModules === 0
                ? 0
                : Math.round(
                    (completedLessonsAllModules / totalLessonsAllModules) * 100,
                  );

            return (
              <tr key={student.id} className="p-0">
                <td colSpan="5" className="p-0">
                  {/* Main Student Row wrapper layout */}
                  <div
                    className="flex items-center w-full hover:bg-gray-50 cursor-pointer transition-colors p-4"
                    onClick={() => toggleStudent(student.id)}
                  >
                    <div className="w-10 text-center text-gray-400 font-bold text-sm">
                      {isExpanded ? "▼" : "▶"}
                    </div>
                    <div className="flex-1 font-semibold text-gray-900">
                      {student.name}
                    </div>

                    {/* NEW COLUMN: Modules Completed Counter */}
                    <div className="flex-1 text-center text-sm text-gray-600 font-mono">
                      {completedModules} / {totalModules}
                    </div>

                    {/* Lessons Completed Counter Column */}
                    <div className="flex-1 text-center text-sm text-gray-500 font-mono">
                      {completedLessonsAllModules} / {totalLessonsAllModules}
                    </div>

                    {/* Overall Lesson-Based Progress Tracker Column */}
                    <div className="w-1/4 flex items-center gap-3">
                      {totalModules === 0 ? (
                        <span className="text-xs text-gray-400 italic">
                          No modules assigned
                        </span>
                      ) : totalLessonsAllModules === 0 ? (
                        <span className="text-xs text-gray-400 italic">
                          No lessons available
                        </span>
                      ) : (
                        <>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${overallProgressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 font-medium min-w-9 text-right">
                            {overallProgressPercentage}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Nested Modules Progress Dropdown */}
                  {isExpanded && totalModules > 0 && (
                    <div className="bg-gray-50/50 border-t border-b border-gray-100 px-14 py-4">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="pb-3 w-1/2">Module Title</th>
                            <th className="pb-3 w-1/4 text-center">
                              Completed Lessons
                            </th>
                            <th className="pb-3 w-1/4">Lesson Progress Bar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {modulesList.map((mod, index) => (
                            <tr key={index}>
                              <td className="py-3 font-medium text-gray-700 flex items-center gap-1.5">
                                {mod.is_module_completed && (
                                  <span
                                    className="text-green-600 font-bold"
                                    title="Completed"
                                  >
                                    ✓
                                  </span>
                                )}
                                {mod.module_title}
                              </td>
                              <td className="py-3 text-center text-gray-600 font-mono">
                                {mod.completed_lessons} / {mod.total_lessons}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${mod.completion_percentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 font-medium min-w-9 text-right">
                                    {Math.round(mod.completion_percentage)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
