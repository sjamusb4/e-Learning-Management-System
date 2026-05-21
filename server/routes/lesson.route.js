const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  handleCreateLesson,
  handleGetLessonsByModuleId,
  handleGetLessonById,
  handleUpdateLesson,
  handleDeleteLesson,
  handleGetAllLessons,
} = require("../controllers/lesson.controller");
const router = express.Router();

router.get("/", authMiddleware, handleGetAllLessons);
router.post("/create", authMiddleware, handleCreateLesson);
router.get("/module/:moduleId", authMiddleware, handleGetLessonsByModuleId);
router.get("/:lessonId", authMiddleware, handleGetLessonById);
router.put("/:lessonId", authMiddleware, handleUpdateLesson);
router.delete("/:lessonId", authMiddleware, handleDeleteLesson);

module.exports = { lessonRouter: router };
