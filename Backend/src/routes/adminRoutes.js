import express from "express";
import {
  getAllUsers,
  createUser,
  getAllProjects,
  createProject,
  assignProject,
  viewAllTasks,
  toggleUser,
  editAnyTask,
  deleteAnyTask,
  getStats,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect, allowRoles("admin"));
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.patch("/users/:id", toggleUser);
router.get("/projects", getAllProjects);
router.post("/projects", createProject);
router.patch("/projects/:projectId", assignProject);
router.get("/tasks", viewAllTasks);
router.put("/tasks/:id", editAnyTask);
router.delete("/tasks/:id", deleteAnyTask);
router.get("/stats", getStats);

export default router;
