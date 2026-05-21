const db = require("../config/db");

async function createModule(moduleData) {
  const { title, description, createdBy } = moduleData;
  const result = await db.query(
    "INSERT INTO modules (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
    [title, description, createdBy],
  );
  return result.rows[0];
}

async function getAllModules() {
  const result = await db.query(
    "SELECT * FROM modules ORDER BY created_at DESC",
  );
  return result.rows;
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

module.exports = {
  createModule,
  getModuleById,
  getAllModulesByCreatedBy,
  updateModule,
  deleteModule,
  getAllModules,
};
