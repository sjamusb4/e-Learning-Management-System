const db = require("../config/db");

async function createUser(userData) {
  const { username, email, passwordHash, role } = userData;

  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.email === email) {
    throw new Error("Email already in use");
  }

  if (existingUser && existingUser.username === username) {
    throw new Error("Username already in use");
  }
  const result = await db.query(
    "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, passwordHash, role],
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function getUserById(userId) {
  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);
  return result.rows[0];
}

async function getAllUsers() {
  const result = await db.query(
    "SELECT user_id, username, email, role FROM users WHERE role <> $1",
    ["Admin"],
  );
  return result.rows;
}
async function deleteUserById(userId) {
  const result = await db.query("DELETE FROM users WHERE user_id=$1", [userId]);
  return result.rows;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  deleteUserById,
};
