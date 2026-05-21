const db = require("../config/db");

async function createLesson(lessonData) {
  const { moduleId, title, content, serialNumber } = lessonData;
  const result = await db.query(
    "INSERT INTO lessons (module_id, title, content, serial_number) VALUES ($1, $2, $3, $4) RETURNING *",
    [moduleId, title, content, serialNumber],
  );
  return result.rows[0];
}

async function getAllLessons() {
  const result = await db.query("SELECT * FROM lessons");
  return result.rows;
}

async function getLessonsByModuleId(moduleId) {
  const result = await db.query(
    "SELECT * FROM lessons WHERE module_id = $1 ORDER BY serial_number ASC",
    [moduleId],
  );
  return result.rows;
}

async function getLessonById(lessonId) {
  const result = await db.query("SELECT * FROM lessons WHERE lesson_id = $1", [
    lessonId,
  ]);
  return result.rows[0];
}

async function updateLesson(lessonId, lessonData) {
  const { title, content, serialNumber } = lessonData;
  const result = await db.query(
    "UPDATE lessons SET title = $1, content = $2, serial_number = $3 WHERE lesson_id = $4 RETURNING *",
    [title, content, serialNumber, lessonId],
  );
  return result.rows[0];
}

async function deleteLesson(lessonId) {
  await db.query("DELETE FROM lessons WHERE lesson_id = $1", [lessonId]);
}

module.exports = {
  createLesson,
  getAllLessons,
  getLessonsByModuleId,
  getLessonById,
  updateLesson,
  deleteLesson,
};
