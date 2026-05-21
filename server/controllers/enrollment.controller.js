const enrollmentModel = require("../models/enrollment.model");
const userModel = require("../models/user.model");
const moduleModel = require("../models/module.model");

async function handleEnrollStudent(req, res) {
  const { studentId, moduleId } = req.body;
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can enroll students",
    });
  }
  try {
    const currentStudent = await userModel.getUserById(studentId);
    if (!currentStudent || currentStudent.role !== "Student") {
      return res.status(400).send({
        msg: "Invalid student ID",
      });
    }

    const currentModule = await moduleModel.getModuleById(moduleId);
    if (!currentModule) {
      return res.status(400).send({
        msg: "Invalid module ID",
      });
    }

    const enrollment = await enrollmentModel.enrollStudent(studentId, moduleId);
    res.send({
      msg: "Student enrolled successfully",
      enrollment_id: enrollment.enrollment_id,
    });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleGetEnrollmentsByStudentId(req, res) {
  const { studentId } = req.params;
  try {
    const currentStudent = await userModel.getUserById(studentId);
    if (!currentStudent || currentStudent.role !== "Student") {
      return res.status(400).send({
        msg: "Invalid student ID",
      });
    }
    const enrollments =
      await enrollmentModel.getEnrollmentsByStudentId(studentId);
    res.send(enrollments);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleGetEnrollmentById(req, res) {
  const { enrollmentId } = req.params;
  try {
    const enrollment = await enrollmentModel.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      return res.status(404).send({
        msg: "Enrollment not found",
      });
    }
    res.send(enrollment);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleGetAllEnrollments(req, res) {
  try {
    const enrollments = await enrollmentModel.getAllEnrollments();
    res.send(enrollments);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleDeleteEnrollment(req, res) {
  const { enrollmentId } = req.params;
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can delete enrollments",
    });
  }
  try {
    const enrollment = await enrollmentModel.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      return res.status(404).send({
        msg: "Enrollment not found",
      });
    }

    await enrollmentModel.deleteEnrollment(enrollmentId);
    res.send({
      msg: "Enrollment deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

module.exports = {
  handleEnrollStudent,
  handleGetEnrollmentsByStudentId,
  handleGetEnrollmentById,
  handleGetAllEnrollments,
  handleDeleteEnrollment,
};
