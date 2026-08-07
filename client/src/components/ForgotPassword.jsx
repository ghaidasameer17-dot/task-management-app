const ForgotPassword = () => {
  return (
    <div className="auth-container">
      <div className="verify-back"><button className="back-btn">→</button></div>
      <div className="auth-header">
        <h2>نسيت كلمة المرور</h2>
        <p>أدخل بريدك المسجّل وسنرسل إليك رمز الاستعادة</p>
      </div>
      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input id="email" type="email" placeholder="example@gmail.com" />
      </div>
      <button className="auth-btn">إرسال الرمز</button>
      <p className="auth-text">تذكّرت كلمة المرور؟<span>تسجيل الدخول</span></p>
    </div>
  );
};

export default ForgotPassword;