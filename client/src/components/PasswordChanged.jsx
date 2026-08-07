const PasswordChanged = () => {
  return (
    <div className="auth-container">
      <div className="success-icon"><span>✓</span></div>
      <div className="auth-header">
        <h2>تم تغيير كلمة المرور</h2>
        <p>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
      </div>
      <button className="auth-btn">تسجيل الدخول</button>
    </div>
  );
};

export default PasswordChanged;
