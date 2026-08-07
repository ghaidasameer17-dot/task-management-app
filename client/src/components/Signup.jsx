import './Login.css';
const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>إنشاء حساب</h2>
        <p>أدخل بياناتك للبدء في تنظيم مهامك</p>
      </div>

      <div className="form-group">
        <label htmlFor="name">الاسم</label>
        <input id="name" type="text" placeholder="مثال: غيداء المحمادي" />
      </div>

      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input id="email" type="email" placeholder="example@gmail.com" />
      </div>

      <div className="form-group">
        <label htmlFor="password">كلمة المرور</label>
        <input id="password" type="password" placeholder="••••••••" />
        <span className="helper-text">٨ أحرف على الأقل</span>
      </div>

      <div className="form-group">
        <label htmlFor="confirm">تأكيد كلمة المرور</label>
        <input id="confirm" type="password" placeholder="••••••••" />
      </div>

      <button className="auth-btn">إنشاء حساب</button>

      <p className="auth-text">
        لديك حساب؟<span>تسجيل الدخول</span>
      </p>
    </div>
  );
};

export default Signup;