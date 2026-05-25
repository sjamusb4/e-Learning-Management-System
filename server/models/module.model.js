const db = require("../config/db");
const {
  studentDashboardDataQuery,
  moduleDatabyModuleIdAndStudentIdQuery,
  allModulesWithAllLessonsQuery,
} = require("./FunctionsQueries");

async function createModule(moduleData) {
  const { title, description, createdBy } = moduleData;
  const result = await db.query(
    "INSERT INTO modules (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
    [title, description, createdBy],
  );
  return result.rows[0];
}

async function getAllModulesWIthLessons(menotrId) {
  const result = await db.query(allModulesWithAllLessonsQuery, [menotrId]);
  return result.rows;
}

async function getAllModules() {
  const result =
    await db.query(`SELECT m.*, u.username AS creator_name, u.email AS creator_email
    FROM modules m
    INNER JOIN users u ON m.created_by = u.user_id;`);
  return result.rows;
}

async function getModuleByIdAndStudentId(studentId, moduleId) {
  const result = await db.query(moduleDatabyModuleIdAndStudentIdQuery, [
    studentId,
    moduleId,
  ]);
  return result.rows[0];
}

async function getModuleById(moduleId) {
  const result = await db.query("SELECT * FROM modules WHERE module_id = $1", [
    moduleId,
  ]);
  return result.rows[0];
}

async function getAllModulesByCreatedBy(createdBy) {
  const result = await db.query(
    "SELECT * FROM modules WHERE created_by = $1 ORDER BY created_at DESC",
    [createdBy],
  );
  return result.rows;
}

async function updateModule(moduleId, moduleData) {
  const { title, description, isActive } = moduleData;
  const result = await db.query(
    "UPDATE modules SET title = $1, description = $2, is_active = $3 WHERE module_id = $4 RETURNING *",
    [title, description, isActive, moduleId],
  );
  return result.rows[0];
}

async function deleteModule(moduleId) {
  await db.query("DELETE FROM modules WHERE module_id = $1", [moduleId]);
}

async function getStudentDashboardData(studentId) {
  const result = await db.query(studentDashboardDataQuery, [studentId]);
  return result.rows;
}

async function activateModuleById(moduleId) {
  const result = await db.query(
    "UPDATE modules SET is_active = NOT is_active WHERE module_id = $1 RETURNING *",
    [moduleId],
  );

  return result.rows;
}

module.exports = {
  createModule,
  getModuleById,
  getAllModules,
  getModuleByIdAndStudentId,
  getAllModulesByCreatedBy,
  updateModule,
  deleteModule,
  getAllModulesWIthLessons,
  getStudentDashboardData,
  activateModuleById,
};
