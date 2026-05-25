const express = require("express");
const {
  handelRegisterUser,
  handelLoginUser,
  handelGetAllUsers,
  handelDeleteUserById,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();

router.get("/", authMiddleware, handelGetAllUsers);
router.delete("/:userId", authMiddleware, handelDeleteUserById);
router.post("/register", handelRegisterUser);
router.post("/login", handelLoginUser);

module.exports = {
  userRouter: router,
};
