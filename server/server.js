import express from "express";
import pool from "./src/config/db.js";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Task Manager API is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});