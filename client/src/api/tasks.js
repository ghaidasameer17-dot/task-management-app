const BASE_URL = "http://localhost:5000/api/tasks";

// نجلب التوكن المحفوظ ونرسله مع كل طلب
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getTasks = async () => {
  const res = await fetch(BASE_URL, { headers: authHeaders() });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل جلب المهام");
  return result;
};

export const createTask = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل إضافة المهمة");
  return result;
};

export const toggleTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل تحديث المهمة");
  return result;
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل حذف المهمة");
  return result;
};

export const clearArchive = async () => {
  const res = await fetch(`${BASE_URL}/archive/clear`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل إفراغ الأرشيف");
  return result;
};

export const updateTask = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل تعديل المهمة");
  return result;
};
