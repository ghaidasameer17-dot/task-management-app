import cron from "node-cron";
import pool from "../config/db.js";
import { sendTaskReminder } from "../utils/email.js";

// يبحث عن المهام التي حان وقت تذكيرها ولم يُرسل تذكيرها بعد، ويرسل بريدًا لكل واحدة
export const runReminderCheck = async () => {
  try {
    const result = await pool.query(
      `SELECT tasks.*, users.email AS user_email, categories.name AS category_name
       FROM tasks
       JOIN users ON tasks.user_id = users.id
       LEFT JOIN categories ON tasks.category_id = categories.id
       WHERE tasks.reminder_at IS NOT NULL
         AND tasks.reminder_at <= NOW()
         AND tasks.reminder_sent = FALSE
         AND tasks.is_completed = FALSE`
    );

    for (const task of result.rows) {
      try {
        await sendTaskReminder(task.user_email, task, task.category_name);
        await pool.query(`UPDATE tasks SET reminder_sent = TRUE WHERE id = $1`, [task.id]);
      } catch (err) {
        console.error(`Failed to send reminder for task ${task.id}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
};

// يفحص كل دقيقة وجود مهام تحتاج تذكيرًا
export const startReminderJob = () => {
  cron.schedule("* * * * *", runReminderCheck);
};
