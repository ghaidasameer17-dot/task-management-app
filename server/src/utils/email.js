import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// إعداد "الناقل" الذي يرسل عبر Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// دالة إرسال رمز التحقق
export const sendVerificationCode = async (to, code) => {
  const mailOptions = {
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject: "رمز التحقق - Task Manager",
    text: `رمز التحقق الخاص بك هو: ${code}\nالرمز صالح لمدة 15 دقيقة.`,
  };

  await transporter.sendMail(mailOptions);
};