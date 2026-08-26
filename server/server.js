import express from "express";
import cors from "cors";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import { startReminderJob } from "./src/jobs/reminderJob.js";

const app = express();
const PORT = 5000;

// وسائط أساسية
app.use(cors());              // يسمح للفرونت بالاتصال
app.use(express.json());      // يقرأ بيانات JSON من الطلبات

// المسارات
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager API is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startReminderJob();
});