const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  handleCreateModule,
  handleGetModuleById,
  handleGetAllModulesByCreatedBy,
  handleUpdateModule,
  handleDeleteModule,
  handleGetAllModules,
} = require("../controllers/module.controller");

const router = express.Router();

router.get("/", authMiddleware, handleGetAllModules);
router.post("/create", authMiddleware, handleCreateModule);
router.get("/created-by", authMiddleware, handleGetAllModulesByCreatedBy);
router.get("/:moduleId", authMiddleware, handleGetModuleById);
router.put("/:moduleId", authMiddleware, handleUpdateModule);
router.delete("/:moduleId", authMiddleware, handleDeleteModule);

module.exports = {
  moduleRouter: router,
};
