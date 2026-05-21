const db = require("../config/db.js");

async function enrollStudent(studentId, moduleId) {
  const result = await db.query(
    "INSERT INTO enrollments (student_id, module_id) VALUES ($1, $2) RETURNING *",
    [studentId, moduleId],
  );
  return result.rows[0];
}

async function getEnrollmentsByStudentId(studentId) {
  const result = await db.query(
    "SELECT e.enrollment_id, e.module_id, m.title AS module_title FROM enrollments e JOIN modules m ON e.module_id = m.module_id WHERE e.student_id = $1",
    [studentId],
  );
  return result.rows;
}

async function getEnrollmentById(enrollmentId) {
  const result = await db.query(
    "SELECT * FROM enrollments WHERE enrollment_id = $1",
    [enrollmentId],
  );
  return result.rows[0];
}

async function getAllEnrollments() {
  const result = await db.query(
    "SELECT e.enrollment_id, e.student_id, u.username AS student_name, e.module_id, m.title AS module_title FROM enrollments e JOIN users u ON e.student_id = u.user_id JOIN modules m ON e.module_id = m.module_id",
  );
  return result.rows;
}

async function deleteEnrollment(enrollmentId) {
  await db.query("DELETE FROM enrollments WHERE enrollment_id = $1", [
    enrollmentId,
  ]);
}

module.exports = {
  enrollStudent,
  getEnrollmentsByStudentId,
  getEnrollmentById,
  getAllEnrollments,
  deleteEnrollment,
};
