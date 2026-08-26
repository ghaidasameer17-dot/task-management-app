import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  clearArchive,
  toggleComplete,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete("/archive/clear", protect, clearArchive);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id/toggle", protect, toggleComplete);

export default router;