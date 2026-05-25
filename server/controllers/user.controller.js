const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function handelRegisterUser(req, res) {
  const { username, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await userModel.createUser({
      username,
      email,
      passwordHash,
      role,
    });
    res.send({
      msg: "Register User successfully",
      user_id: user.user_id,
      user_role: user.role,
    });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}
async function handelLoginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return res.status(401).send({
          msg: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { user_id: user.user_id, user_role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
      );

      res.send({
        user_id: user.user_id,
        user_role: user.role,
        token,
      });
    } else {
      res.status(401).send({
        msg: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: "Internal server error",
    });
  }
}

async function handelGetUserById(req, res) {
  const { userId } = req.params;
  try {
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handelGetAllUsers(req, res) {
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view all modules",
    });
  }
  try {
    const users = await userModel.getAllUsers();
    if (!users) {
      return res.status(404).send({
        msg: "Users not found",
      });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}
async function handelDeleteUserById(req, res) {
  const { userId } = req.params;
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view all modules",
    });
  }
  try {
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }
    const users = await userModel.deleteUserById(userId);
    if (!users) {
      return res.status(404).send({
        msg: "Error deleting user",
      });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

module.exports = {
  handelRegisterUser,
  handelLoginUser,
  handelGetUserById,
  handelGetAllUsers,
  handelDeleteUserById,
};
