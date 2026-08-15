import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protect = (req, res, next) => {
  try {
    // التوكن يجي في ترويسة Authorization بصيغة: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "غير مصرّح، التوكن مفقود" });
    }

    const token = authHeader.split(" ")[1];

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نحفظ id المستخدم في req عشان الدوال التالية تستخدمه
    req.userId = decoded.id;

    next(); // نكمل للدالة التالية
  } catch (err) {
    return res.status(401).json({ message: "غير مصرّح، التوكن غير صالح" });
  }
};