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

const PRIORITY_TRIANGLE = { urgent: '▲ ', medium: '▬ ', not_urgent: '▼ ' };

// عنوان المهمة واسم الفئة يدخل المستخدم، فنهرب رموز HTML قبل حقنها بجسم الرسالة
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// إرسال تذكير بموعد مهمة (قبل الموعد بـ 24 ساعة)
export const sendTaskReminder = async (to, task, categoryName) => {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const dateStr = dueDate ? `${dueDate.getDate()}/${dueDate.getMonth() + 1}` : '';
  const timeStr = task.due_time ? task.due_time.slice(0, 5) : '';
  const priorityMark = PRIORITY_TRIANGLE[task.priority] || '';
  const safeTitle = escapeHtml(task.title);
  const catBadge = categoryName
    ? ` <span style="background:#E9F0FF;color:#2F6FED;border-radius:20px;padding:2px 10px;font-size:11px;">${escapeHtml(categoryName)}</span>`
    : '';

  const html = `
  <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; background:#F0F2F5; padding: 32px 16px;">
    <div style="max-width:380px; margin:0 auto; background:#ffffff; border-radius:16px; padding:28px 24px; text-align:center;">
      <div style="width:56px;height:56px;border-radius:50%;background:#2F6FED;color:#fff;margin:0 auto 16px;font-size:26px;line-height:56px;">&#10003;</div>
      <h2 style="margin:0 0 6px;font-size:19px;color:#1c1c1e;">تذكير بموعد مهمتك</h2>
      <p style="margin:0 0 20px;font-size:13px;color:#6c6c76;">اقترب موعد المهمة التالية:</p>
      <div style="background:#F4F5F8;border-radius:12px;padding:14px 16px;text-align:right;margin-bottom:20px;">
        <div style="font-size:14px;color:#1c1c1e;font-weight:bold;">${priorityMark}${safeTitle}${catBadge}</div>
        <div style="font-size:12px;color:#6c6c76;margin-top:6px;">الموعد: ${dateStr}${timeStr ? ` ${timeStr}` : ''}</div>
      </div>
      <a href="http://localhost:5173/tasks" style="display:inline-block;background:#2F6FED;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;border-radius:12px;padding:12px 28px;">فتح التطبيق</a>
      <p style="margin:22px 0 0;font-size:11px;color:#9a9aa2;">يُرسل هذا التذكير مرة واحدة لكل مهمة. لإيقاف التذكيرات: الإعدادات ← التذكيرات</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject: `تذكير بموعد مهمتك — «${task.title}»`,
    html,
  });
};