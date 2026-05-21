const moduleModel = require("../models/module.model.js");

//can be accessed by admin and mentor only
async function handleCreateModule(req, res) {
  const { title, description } = req.body;
  const { user_id, user_role } = req.user; // from auth middleware

  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can create modules",
    });
  }

  try {
    const module = await moduleModel.createModule({
      title,
      description,
      createdBy: user_id,
    });

    res.send({
      msg: "Module created successfully",
      module_id: module.module_id,
    });
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

//can be accessed by admin only
async function handleGetAllModules(req, res) {
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin") {
    return res.status(403).send({
      msg: "Forbidden: Only admin can view all modules",
    });
  }
  try {
    const modules = await moduleModel.getAllModules();
    res.send(modules);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

//can be accessed by admin, mentor and student
async function handleGetModuleById(req, res) {
  const { moduleId } = req.params;
  try {
    const module = await moduleModel.getModuleById(moduleId);
    if (module) {
      res.send(module);
    } else {
      res.status(404).send({
        msg: "Module not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

//can be accessed by admin and mentor only
async function handleGetAllModulesByCreatedBy(req, res) {
  const { user_id, user_role } = req.user; // from auth middleware

  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can view modules",
    });
  }
  try {
    const modules = await moduleModel.getAllModulesByCreatedBy(user_id);
    res.send(modules);
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

//can be accessed by admin and mentor only
async function handleUpdateModule(req, res) {
  const { moduleId } = req.params;
  const { title, description, isActive } = req.body;

  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can update modules",
    });
  }
  try {
    const updatedModule = await moduleModel.updateModule(moduleId, {
      title,
      description,
      isActive,
    });
    if (updatedModule) {
      res.send({
        msg: "Module updated successfully",
        module_id: updatedModule.module_id,
      });
    } else {
      res.status(404).send({
        msg: "Module not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      msg: error.message,
    });
  }
}

//can be accessed by admin and mentor only
async function handleDeleteModule(req, res) {
  const { moduleId } = req.params;
  const { user_role } = req.user; // from auth middleware
  if (user_role !== "Admin" && user_role !== "Mentor") {
    return res.status(403).send({
      msg: "Forbidden: Only admin and mentor can delete modules",
    });
  }
  try {
    const currentModule = await moduleModel.getModuleById(moduleId);
    if (!currentModule) {
      return res.status(404).send({
        msg: "Module not found",
      });
    }

    await moduleModel.deleteModule(moduleId);
    res.send({
      msg: "Module deleted successfully",
      module_id: moduleId,
    });
  } catch (error) {
    res.status(500).send({
      msg: error.message,
    });
  }
}

module.exports = {
  handleCreateModule,
  handleGetAllModules,
  handleGetModuleById,
  handleGetAllModulesByCreatedBy,
  handleUpdateModule,
  handleDeleteModule,
};
