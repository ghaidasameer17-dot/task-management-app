import pool from "../config/db.js";

// عرض كل مهام المستخدم
export const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// إضافة مهمة جديدة
export const createTask = async (req, res) => {
  try {
    const { title, due_date, due_time, priority, category_id } = req.body;

    // اسم المهمة هو الحقل الإلزامي الوحيد (FR-09)
    if (!title) {
      return res.status(400).json({ message: "اسم المهمة مطلوب" });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, due_date, due_time, priority, category_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        due_date || null,
        due_time || null,
        priority || null,
        category_id || null,
        req.userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};
// تعديل مهمة
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, due_date, due_time, priority, category_id } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, due_date = $2, due_time = $3, priority = $4, category_id = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, due_date || null, due_time || null, priority || null, category_id || null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المهمة غير موجودة" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update task error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// حذف مهمة
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المهمة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف المهمة" });
  } catch (err) {
    console.error("Delete task error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// تبديل حالة الإكمال
export const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    // نجلب المهمة أولًا لمعرفة حالتها الحالية
    const current = await pool.query(
      `SELECT is_completed FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: "المهمة غير موجودة" });
    }

    const newStatus = !current.rows[0].is_completed;
    // عند الإكمال نسجّل الوقت، وعند الإرجاع نصفّره (FR-17)
    const completedAt = newStatus ? new Date() : null;

    const result = await pool.query(
      `UPDATE tasks
       SET is_completed = $1, completed_at = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [newStatus, completedAt, id, req.userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Toggle complete error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};