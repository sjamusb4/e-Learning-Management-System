const db = require("../config/db");
const { allsStudentLessonProgressQuery } = require("./FunctionsQueries");

async function createLessonProgress(studentId, lessonId) {
  const result = await db.query(
    `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP) ON CONFLICT (student_id, lesson_id) DO NOTHING RETURNING *;`,
    [studentId, lessonId],
  );
  return result.rows[0];
}

async function updateLessonProgress(
  completed,
  studentId,
  lessonId,
  completedAt,
) {
  const result = await db.query(
    `UPDATE lesson_progress SET completed = $1, 
     completed_at = $2 
     WHERE student_id = $3 
     AND lesson_id = $4 
     RETURNING *;`,
    [completed, completedAt, studentId, lessonId],
  );
  return result.rows[0];
}

async function getLessonProgressByStudentAndLesson(studentId, lessonId) {
  // This query joins the lesson_progress table with the users table to get the student's name along with their progress details for a specific lesson.
  const result = await db.query(
    "SELECT u.user_id, u.username as student_name, lp.progress_id, lp.completed, lp.completed_at FROM lesson_progress lp JOIN users u ON lp.student_id = u.user_id WHERE lp.student_id = $1 AND lp.lesson_id = $2",
    [studentId, lessonId],
  );
  return result.rows[0];
}

async function getLessonProgressByStudent(studentId) {
  const result = await db.query(
    "SELECT * FROM lesson_progress WHERE student_id = $1",
    [studentId],
  );
  return result.rows;
}
async function getAllStudnetLEssonProgress() {
  const result = await db.query(allsStudentLessonProgressQuery);
  return result.rows;
}

module.exports = {
  createLessonProgress,
  updateLessonProgress,
  getLessonProgressByStudentAndLesson,
  getLessonProgressByStudent,
  getAllStudnetLEssonProgress,
};
