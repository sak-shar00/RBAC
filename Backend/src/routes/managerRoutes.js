import express from "express";
import {
  createTask,
  editOwnTask,
  deleteOwnTask,
  getMyProjects,
  getAllDevelopers,
  getAllTasks,
  assignTaskToDeveloper,
  getTaskById,
  getManagerStats
} from "../controllers/managerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect, allowRoles("manager"));

// Project routes
router.get("/projects", getMyProjects);

// Stats route
router.get("/stats", getManagerStats);

// Developer routes
router.get("/developers", getAllDevelopers);

// Task routes
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", createTask);
router.put("/tasks/:id", editOwnTask);
router.put("/tasks/:id/assign", assignTaskToDeveloper);
router.delete("/tasks/:id", deleteOwnTask);

export default router;

