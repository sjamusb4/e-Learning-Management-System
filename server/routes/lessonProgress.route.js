const express = require("express");
const { ro } = require("zod/v4/locales");
const { authMiddleware } = require("../middlewares/auth");
const {
  handleCreateLessonProgress,
  handleUpdateLessonProgress,
  handleGetLessonProgressByStudent,
  handleGetLessonProgressByStudentAndLesson,
  handleGetAllStudentLessonProgress,
} = require("../controllers/lessonProgress.controller");
const router = express.Router();

router.get("/all", authMiddleware, handleGetAllStudentLessonProgress);
router.post("/", authMiddleware, handleCreateLessonProgress);
router.put("/:lessonId", authMiddleware, handleUpdateLessonProgress);
router.get("/student", authMiddleware, handleGetLessonProgressByStudent);
router.get(
  "/student/:lessonId",
  authMiddleware,
  handleGetLessonProgressByStudentAndLesson,
);

module.exports = {
  lessonProgressRouter: router,
};
