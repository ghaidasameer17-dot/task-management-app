// توليد رمز تحقق من 4 أرقام (0000 - 9999)
export const generateCode = () => {
  const code = Math.floor(Math.random() * 10000); // رقم من 0 إلى 9999
  return code.toString().padStart(4, "0");        // يضمن 4 خانات دائمًا
};