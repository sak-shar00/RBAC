import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;
    
    // Verify manager owns the project (if project is provided)
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (projectDoc.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only create tasks in your own projects" });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit own task
export const editOwnTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this task" });
    }

    // If trying to change project, verify ownership
    if (req.body.project) {
      const projectDoc = await Project.findById(req.body.project);
      if (!projectDoc || projectDoc.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only assign tasks to your own projects" });
      }
    }

    Object.assign(task, req.body);
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete own task
export const deleteOwnTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects assigned to manager
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ manager: req.user._id }).populate("manager", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all developers
export const getAllDevelopers = async (req, res) => {
  try {
    const developers = await User.find({ role: "developer", isActive: true }).select("-password");
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks (created by manager or in their projects)
export const getAllTasks = async (req, res) => {
  try {
    const { status, project, assignedTo } = req.query;
    
    // Get manager's projects
    const managerProjects = await Project.find({ manager: req.user._id }).select("_id");
    const projectIds = managerProjects.map(p => p._id);
    
    // Build query: tasks in manager's projects OR created by manager
    const query = {
      $or: [
        { project: { $in: projectIds } },
        { createdBy: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }
    if (project) {
      query.project = project;
    }
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign task to a developer
export const assignTaskToDeveloper = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    // Verify assigned user is a developer
    const developer = await User.findOne({ _id: assignedTo, role: "developer", isActive: true });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found or inactive" });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if manager owns the project or created the task
    const isProjectManager = task.project 
      ? (await Project.findById(task.project))?.manager.toString() === req.user._id.toString()
      : false;
    
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isProjectManager && !isTaskCreator) {
      return res.status(403).json({ message: "Not allowed to assign this task" });
    }

    task.assignedTo = assignedTo;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name description manager")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify manager has access
    const isProjectManager = task.project?.manager 
      ? task.project.manager.toString() === req.user._id.toString()
      : false;
    const isTaskCreator = task.createdBy._id.toString() === req.user._id.toString();

    if (!isProjectManager && !isTaskCreator) {
      return res.status(403).json({ message: "Not allowed to view this task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get manager stats
export const getManagerStats = async (req, res) => {
  try {
    const projects = await Project.find({ manager: req.user._id });
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });
    const developers = await User.find({ role: "developer", isActive: true });
    
    res.json({
      projects: projects.length,
      tasks: tasks.length,
      developers: developers.length,
      pendingTasks: tasks.filter(t => t.status === "pending").length,
      completedTasks: tasks.filter(t => t.status === "completed").length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

