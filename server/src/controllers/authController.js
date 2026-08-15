import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateCode } from "../utils/generateCode.js";
import { sendVerificationCode } from "../utils/email.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. التحقق من وجود الحقول المطلوبة
    if (!name || !email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // 2. فحص هل البريد مستخدم من قبل
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.is_verified) {
        // حساب مفعّل → نرفض
        return res.status(409).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }
      // حساب غير مفعّل → (نتعامل معه لاحقًا: إعادة إرسال الرمز)
      return res.status(409).json({ message: "الحساب موجود لكنه غير مفعّل" });
    }

    // 3. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. توليد رمز التحقق ووقت انتهائه (15 دقيقة)
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 5. حفظ المستخدم بالقاعدة
    const result = await pool.query(
      `INSERT INTO users (name, email, password, verification_code, code_expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email`,
      [name, email, hashedPassword, code, expiresAt]
    );

    // 6. إرسال الرمز للبريد
    await sendVerificationCode(email, code);

    // 7. الرد بنجاح
    res.status(201).json({
      message: "تم إنشاء الحساب، تحقق من بريدك للحصول على رمز التفعيل",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};