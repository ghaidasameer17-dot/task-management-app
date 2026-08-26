// حساب وقت التذكير: قبل موعد المهمة بـ 24 ساعة (يتطلب تاريخ ووقت استحقاق محددين)
export const computeReminderAt = (dueDate, dueTime) => {
  if (!dueDate || !dueTime) return null;
  const due = new Date(`${dueDate}T${dueTime}`);
  if (Number.isNaN(due.getTime())) return null;
  return new Date(due.getTime() - 24 * 60 * 60 * 1000);
};
