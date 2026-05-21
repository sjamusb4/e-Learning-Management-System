const lessonModel = require("../models/lesson.model");
const moduleModel = require("../models/module.model");

async function handleCreateLesson(req, res) {
  const { title, content, serialNumber, moduleId } = req.body;
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can create lessons",
    });
  }

  try {
    const module = await moduleModel.getModuleById(moduleId);
    if (!module) {
      return res.status(404).send({
        msg: "Module not found",
      });
    }

    const lesson = await lessonModel.createLesson({
      title,
      content,
      serialNumber,
      moduleId,
    });
    res.send({
      msg: "Lesson created successfully",
      lesson_id: lesson.lesson_id,
    });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleGetAllLessons(req, res) {
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin") {
    return res.status(403).send({
      msg: "Forbidden: Only admin can view all modules",
    });
  }

  try {
    const lessons = await lessonModel.getAllLessons();
    res.send(lessons);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleGetLessonsByModuleId(req, res) {
  const { moduleId } = req.params;
  try {
    const module = await moduleModel.getModuleById(moduleId);
    if (!module) {
      return res.status(404).send({
        msg: "Module not found",
      });
    }
    const lessons = await lessonModel.getLessonsByModuleId(moduleId);
    res.send(lessons);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleGetLessonById(req, res) {
  const { lessonId } = req.params;
  try {
    const lesson = await lessonModel.getLessonById(lessonId);
    if (lesson) {
      res.send(lesson);
    } else {
      res.status(404).send({
        msg: "Lesson not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

async function handleUpdateLesson(req, res) {
  const { lessonId } = req.params;
  const { title, content, serialNumber } = req.body;
  const { user_role } = req.user;

  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can update lessons",
    });
  }

  try {
    const lesson = await lessonModel.updateLesson(lessonId, {
      title,
      content,
      serialNumber,
    });
    if (lesson) {
      res.send({
        msg: "Lesson updated successfully",
        lesson_id: lesson.lesson_id,
      });
    } else {
      res.status(404).send({
        msg: "Lesson not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

async function handleDeleteLesson(req, res) {
  const { lessonId } = req.params;
  const { user_role } = req.user;
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can delete lessons",
    });
  }
  try {
    const lesson = await lessonModel.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).send({
        msg: "Lesson not found",
      });
    }

    await lessonModel.deleteLesson(lessonId);
    res.send({
      msg: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

module.exports = {
  handleCreateLesson,
  handleGetAllLessons,
  handleGetLessonsByModuleId,
  handleGetLessonById,
  handleUpdateLesson,
  handleDeleteLesson,
};
