const BASE_URL = "http://localhost:5000/api/auth";

// دالة مساعدة عامة لإرسال الطلبات
const request = async (endpoint, data) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // لو الباك اند رد بخطأ، نرمي الرسالة عشان الشاشة تمسكها
  if (!res.ok) {
    throw new Error(result.message || "حدث خطأ");
  }

  return result;
};

// دوال المصادقة
export const registerUser = (data) => request("/register", data);
export const verifyEmail = (data) => request("/verify", data);
export const resendVerification = (data) => request("/resend-verification", data);
export const loginUser = (data) => request("/login", data);
export const forgotPassword = (data) => request("/forgot-password", data);
export const verifyResetCode = (data) => request("/verify-reset-code", data);
export const resetPassword = (data) => request("/reset-password", data);