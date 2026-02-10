import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// users
export const getAllUsers = async (req, res) => {
  res.json(await User.find().select("-password"));
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
};

export const toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: "User status updated" });
};

// projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("manager", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    const populatedProject = await Project.findById(project._id)
      .populate("manager", "name email");
    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  project.manager = req.body.managerId;
  await project.save();
  const populatedProject = await Project.findById(project._id)
    .populate("manager", "name email");
  res.json(populatedProject);
};

// tasks
export const viewAllTasks = async (req, res) => {
  res.json(await Task.find()
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name"));
};

export const editAnyTask = async (req, res) => {
  res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

export const deleteAnyTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

// stats
export const getStats = async (req, res) => {
  const users = await User.find();
  const projects = await Project.find();
  const tasks = await Task.find();
  res.json({
    users: users.length,
    projects: projects.length,
    tasks: tasks.length,
    activeUsers: users.filter(u => u.isActive).length,
    pendingTasks: tasks.filter(t => t.status === "pending").length,
    completedTasks: tasks.filter(t => t.status === "completed").length,
  });
};
