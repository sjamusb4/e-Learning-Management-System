const express = require("express");
const { ro } = require("zod/v4/locales");
const { authMiddleware } = require("../middlewares/auth");
const {
  handleCreateLessonProgress,
  handleUpdateLessonProgress,
  handleGetLessonProgressByStudent,
  handleGetLessonProgressByStudentAndLesson,
} = require("../controllers/lessonProgress.controller");
const router = express.Router();

router.post("/", authMiddleware, handleCreateLessonProgress);
router.put("/:progressId", authMiddleware, handleUpdateLessonProgress);
router.get("/student", authMiddleware, handleGetLessonProgressByStudent);
router.get(
  "/student/:lessonId",
  authMiddleware,
  handleGetLessonProgressByStudentAndLesson,
);

module.exports = {
  lessonProgressRouter: router,
};
