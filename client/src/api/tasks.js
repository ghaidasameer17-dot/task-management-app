const BASE_URL = "http://localhost:5000/api/tasks";

// نجلب التوكن المحفوظ ونرسله مع كل طلب
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getTasks = async () => {
  const res = await fetch(BASE_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error("فشل جلب المهام");
  return res.json();
};

export const createTask = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل إضافة المهمة");
  return res.json();
};

export const toggleTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("فشل تحديث المهمة");
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("فشل حذف المهمة");
  return res.json();
};