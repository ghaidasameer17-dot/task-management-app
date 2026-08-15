import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runSchema = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    await pool.query(sql);
    console.log(" Schema created successfully");
  } catch (err) {
    console.error(" Failed to create schema:", err.message);
  } finally {
    await pool.end();
  }
};

runSchema();