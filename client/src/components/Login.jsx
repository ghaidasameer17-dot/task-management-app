import "./Login.css";
const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>تسجيل الدخول </h2>
        <p>سجل دخولك لمتابعة مهامك</p>
      </div>
      <div className="error-banner">
        <span>⚠</span>
        <p>البريد الإلكتروني أو كلمة المرور غير صحيحة</p>
      </div>

      <div className="form-group">
        <label htmlFor="email">البريد الالكتروني</label>
        <input
          id="email"
          type="email"
          placeholder="example@gmail.com "
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">كلمة المرور</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="********"
        />
      </div>

      <a href="#" className="forgot-link">
        نسيت كلمة المرور؟
      </a>
      <button className="auth-btn">تسجيل الدخول</button>
      <p className="signup-text">
        ليس لديك حساب؟<span>انشاء حساب</span>
      </p>
    </div>
  );
};

export default Login;
