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
        { expiresIn: "1h" },
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

module.exports = {
  handelRegisterUser,
  handelLoginUser,
};
