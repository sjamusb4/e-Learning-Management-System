const lessonProgressModel = require("../models/lessonProgress.model");

async function handleCreateLessonProgress(req, res) {
  const { lessonId } = req.body;
  const { user_role, user_id } = req.user;
  if (user_role !== "Student") {
    return res.status(403).send({
      msg: "Forbidden: Only students can create lesson progress",
    });
  }

  try {
    const existingProgress =
      await lessonProgressModel.getLessonProgressByStudentAndLesson(
        user_id,
        lessonId,
      );
    if (existingProgress) {
      return res.status(400).send({
        msg: "Lesson progress already exists for this student and lesson",
      });
    }

    const progress = await lessonProgressModel.createLessonProgress(
      user_id,
      lessonId,
    );
    res.send({
      msg: "Lesson progress created successfully",
      progress_id: progress.progress_id,
    });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleUpdateLessonProgress(req, res) {
  const { lessonId } = req.params;
  const { completed } = req.body;
  const completedAt = completed ? new Date() : null;
  const { user_role, user_id } = req.user;
  if (user_role !== "Student") {
    return res.status(403).send({
      msg: "Forbidden: Only students can update lesson progress",
    });
  }

  try {
    const progress = await lessonProgressModel.updateLessonProgress(
      completed,
      user_id,
      lessonId,
      completedAt,
    );
    if (progress) {
      res.send({
        msg: "Lesson progress updated successfully",
        progress_id: progress.progress_id,
      });
    } else {
      res.status(404).send({
        msg: "Lesson progress not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleGetLessonProgressByStudent(req, res) {
  const { user_id } = req.user;
  const { user_role } = req.user;
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view lesson progress",
    });
  }
  try {
    const progressList =
      await lessonProgressModel.getLessonProgressByStudent(user_id);
    res.send({ progress: progressList });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleGetLessonProgressByStudentAndLesson(req, res) {
  const { user_id } = req.user;
  const { lessonId } = req.params;
  const { user_role } = req.user;
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view lesson progress",
    });
  }
  try {
    const progress =
      await lessonProgressModel.getLessonProgressByStudentAndLesson(
        user_id,
        lessonId,
      );
    if (progress) {
      res.send({ progress });
    } else {
      res.status(404).send({
        msg: "Lesson progress not found for this student and lesson",
      });
    }
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}
async function handleGetAllStudentLessonProgress(req, res) {
  const { user_role } = req.user;
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view lesson progress",
    });
  }
  try {
    const progress = await lessonProgressModel.getAllStudnetLEssonProgress();
    if (progress) {
      res.send({ progress });
    } else {
      res.status(404).send({
        msg: "Lesson progress not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

module.exports = {
  handleCreateLessonProgress,
  handleUpdateLessonProgress,
  handleGetLessonProgressByStudent,
  handleGetLessonProgressByStudentAndLesson,
  handleGetAllStudentLessonProgress,
};
