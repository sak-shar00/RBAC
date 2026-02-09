import Task from "../models/Task.js";

export const myTasks = async (req, res) => {
  res.json(await Task.find({ assignedTo: req.user._id }));
};

export const updateStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task.assignedTo.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  task.status = req.body.status;
  await task.save();
  res.json(task);
};