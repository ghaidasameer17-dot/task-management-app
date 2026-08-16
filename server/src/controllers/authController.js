import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateCode } from "../utils/generateCode.js";
import { sendVerificationCode } from "../utils/email.js";
import jwt from "jsonwebtoken";

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
    return res.status(409).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
  }

  // حساب غير مفعّل → إعادة إرسال رمز جديد والانتقال لشاشة التفعيل
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    "UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE email = $3",
    [code, expiresAt, email]
  );

  await sendVerificationCode(email, code);

  return res.status(200).json({
    message: "هذا الحساب موجود لكنه غير مفعّل، تم إرسال رمز تفعيل جديد",
    needsVerification: true,
  });
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

// تفعيل الحساب بإدخال الرمز
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. التحقق من وجود الحقول
    if (!email || !code) {
      return res.status(400).json({ message: "البريد والرمز مطلوبان" });
    }

    // 2. جلب المستخدم
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const user = result.rows[0];

    // 3. الحساب مفعّل مسبقًا؟
    if (user.is_verified) {
      return res.status(400).json({ message: "الحساب مفعّل بالفعل" });
    }

    // 4. الرمز صحيح؟
    if (user.verification_code !== code) {
      return res.status(400).json({ message: "الرمز غير صحيح" });
    }

    // 5. الرمز منتهي الصلاحية؟
    if (new Date() > new Date(user.code_expires_at)) {
      return res.status(400).json({ message: "انتهت صلاحية الرمز" });
    }

    // 6. تفعيل الحساب ومسح الرمز
    await pool.query(
      `UPDATE users
       SET is_verified = TRUE, verification_code = NULL, code_expires_at = NULL
       WHERE email = $1`,
      [email]
    );
    const systemCategories = [
      { name: 'عمل', color: '#2F6FED' },
      { name: 'شخصي', color: '#8B5CF6' },
      { name: 'دراسة', color: '#22C55E' },
      { name: 'منزل', color: '#F59E0B' },
    ];

    for (const cat of systemCategories) {
      await pool.query(
        `INSERT INTO categories (name, color, is_system, user_id)
         VALUES ($1, $2, TRUE, $3)`,
        [cat.name, cat.color, user.id]
      );
    }

    // 7. الرد بنجاح
    res.status(200).json({ message: "تم تفعيل الحساب بنجاح" });
  } catch (err) {
    console.error("Verify error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};
// تسجيل الدخول
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. التحقق من وجود الحقول
    if (!email || !password) {
      return res.status(400).json({ message: "البريد وكلمة المرور مطلوبان" });
    }

    // 2. جلب المستخدم
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // 3. رسالة خطأ عامة (FR-03) — لا نكشف أي الحقلين غير صحيح
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const user = result.rows[0];

    // 4. الحساب مفعّل؟
    if (!user.is_verified) {
      return res.status(403).json({ message: "الحساب غير مفعّل، تحقق من بريدك" });
    }

    // 5. مقارنة كلمة المرور بالمشفّرة
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 6. إصدار توكن JWT
    const token = jwt.sign(
      { id: user.id },                 // البيانات المخزّنة داخل التوكن
      process.env.JWT_SECRET,          // المفتاح السري
      { expiresIn: "7d" }              // صلاحية 7 أيام (FR-39)
    );

    // 7. الرد بالتوكن وبيانات المستخدم (بدون كلمة المرور)
    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};
// استعادة كلمة المرور — الخطوة 1: طلب رمز الاستعادة
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
    }

    // جلب المستخدم — رسالة صريحة إن لم يكن مسجّلًا (FR-04)
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "البريد الإلكتروني غير مسجّل" });
    }

    // توليد رمز استعادة وحفظه (يعيد استخدام نفس العمودين)
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      "UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE email = $3",
      [code, expiresAt, email]
    );

    // إرسال الرمز
    await sendVerificationCode(email, code);

    res.status(200).json({ message: "تم إرسال رمز الاستعادة إلى بريدك" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// الخطوة 2: التحقق من رمز الاستعادة
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "البريد والرمز مطلوبان" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const user = result.rows[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ message: "الرمز غير صحيح" });
    }

    if (new Date() > new Date(user.code_expires_at)) {
      return res.status(400).json({ message: "انتهت صلاحية الرمز" });
    }

    res.status(200).json({ message: "الرمز صحيح" });
  } catch (err) {
    console.error("Verify reset code error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// الخطوة 3: تعيين كلمة مرور جديدة
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const user = result.rows[0];

    // إعادة التحقق من الرمز كإذن قبل الحفظ
    if (user.verification_code !== code) {
      return res.status(400).json({ message: "الرمز غير صحيح" });
    }

    if (new Date() > new Date(user.code_expires_at)) {
      return res.status(400).json({ message: "انتهت صلاحية الرمز" });
    }

    // تشفير كلمة المرور الجديدة وحفظها، وإلغاء الرمز
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password = $1, verification_code = NULL, code_expires_at = NULL
       WHERE email = $2`,
      [hashedPassword, email]
    );

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};