const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  handleCreateModule,
  handleGetModuleByIdAndStudentId,
  handleGetAllModulesByCreatedBy,
  handleUpdateModule,
  handleDeleteModule,
  handleGetAllModulesWithLessons,
  handleGetStudentDashboardData,
  handleGetModuleById,
  handdleActivateModuleById,
} = require("../controllers/module.controller");

const router = express.Router();

router.get("/", authMiddleware, handleGetAllModulesWithLessons);
router.get(
  "/student-dashboard/:studentId",
  authMiddleware,
  handleGetStudentDashboardData,
);
router.post("/create", authMiddleware, handleCreateModule);
router.get("/created-by", authMiddleware, handleGetAllModulesByCreatedBy);
router.post(
  "/student/:moduleId",
  authMiddleware,
  handleGetModuleByIdAndStudentId,
);
router.get("/:moduleId", authMiddleware, handleGetModuleById);
router.put("/:moduleId", authMiddleware, handleUpdateModule);
router.delete("/:moduleId", authMiddleware, handleDeleteModule);
router.patch("/toggle/:moduleId", authMiddleware, handdleActivateModuleById);

module.exports = {
  moduleRouter: router,
};
