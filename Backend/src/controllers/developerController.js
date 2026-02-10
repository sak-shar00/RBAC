import Task from "../models/Task.js";

export const myTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = req.body.status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("createdBy", "name");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const tasks = await Task.find({ assignedTo: userId });
    
    const stats = {
      assignedTasks: tasks.length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      pending: tasks.filter(t => t.status === "pending").length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
