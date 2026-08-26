const BASE_URL = "http://localhost:5000/api/categories";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getCategories = async () => {
  const res = await fetch(BASE_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error("فشل جلب الفئات");
  return res.json();
};

export const createCategory = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل إضافة الفئة");
  return result;
};

export const updateCategory = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل تعديل الفئة");
  return result;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل حذف الفئة");
  return result;
};
