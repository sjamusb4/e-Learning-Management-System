const express = require("express");
const {
  handelRegisterUser,
  handelLoginUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", handelRegisterUser);
router.post("/login", handelLoginUser);

module.exports = {
  userRouter: router,
};
