const express = require("express");
const { authMiddleware } = require("../middlewares/auth");

const {
  handleEnrollStudent,
  handleGetEnrollmentsByStudentId,
  handleDeleteEnrollment,
  handleGetEnrollmentById,
  handleGetAllEnrollments,
} = require("../controllers/enrollment.controller");
const router = express.Router();

router.get("/", authMiddleware, handleGetAllEnrollments);
router.post("/enroll", authMiddleware, handleEnrollStudent);
router.get(
  "/student/:studentId",
  authMiddleware,
  handleGetEnrollmentsByStudentId,
);
router.get("/:enrollmentId", authMiddleware, handleGetEnrollmentById);
router.delete("/:enrollmentId", authMiddleware, handleDeleteEnrollment);

module.exports = {
  enrollmentRouter: router,
};
