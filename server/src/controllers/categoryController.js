import pool from "../config/db.js";

// عرض فئات المستخدم
export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM categories WHERE user_id = $1 ORDER BY is_system DESC, created_at ASC`,
      [req.userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get categories error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// إنشاء فئة
export const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ message: "الاسم واللون مطلوبان" });
    }

    // منع التكرار لنفس المستخدم (FR-41)
    const existing = await pool.query(
      `SELECT * FROM categories WHERE user_id = $1 AND name = $2`,
      [req.userId, name]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "توجد فئة بنفس الاسم" });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, color, is_system, user_id)
       VALUES ($1, $2, FALSE, $3)
       RETURNING *`,
      [name, color, req.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create category error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// تعديل فئة (فئات المستخدم فقط، لا النظام)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    // نتأكد أنها فئة المستخدم وليست نظام
    const check = await pool.query(
      `SELECT * FROM categories WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "الفئة غير موجودة" });
    }
    if (check.rows[0].is_system) {
      return res.status(403).json({ message: "لا يمكن تعديل فئات النظام" });
    }

    const result = await pool.query(
      `UPDATE categories SET name = $1, color = $2
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [name, color, id, req.userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update category error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// حذف فئة (فئات المستخدم فقط)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      `SELECT * FROM categories WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "الفئة غير موجودة" });
    }
    if (check.rows[0].is_system) {
      return res.status(403).json({ message: "لا يمكن حذف فئات النظام" });
    }

    // الحذف — مهام هذه الفئة تصبح بلا فئة تلقائيًا (ON DELETE SET NULL)
    await pool.query(
      `DELETE FROM categories WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    res.status(200).json({ message: "تم حذف الفئة" });
  } catch (err) {
    console.error("Delete category error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};