import express from "express";
import {
  myTasks,
updateStatus,
} from "../controllers/developerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect, allowRoles("developer"));
router.get("/tasks", myTasks);
router.patch("/tasks/:id/status", updateStatus);
export default router;