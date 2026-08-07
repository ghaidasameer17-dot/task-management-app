const NewPassword = () => {
  return (
    <div className="auth-container">
      <div className="verify-back"><button className="back-btn">→</button></div>
      <div className="auth-header">
        <h2>كلمة مرور جديدة</h2>
        <p>اختر كلمة مرور جديدة لحسابك</p>
      </div>
      <div className="form-group">
        <label htmlFor="new">كلمة المرور الجديدة</label>
        <input id="new" type="password" placeholder="••••••••" />
        <span className="helper-text">٨ أحرف على الأقل</span>
      </div>
      <div className="form-group">
        <label htmlFor="confirm">تأكيد كلمة المرور الجديدة</label>
        <input id="confirm" type="password" placeholder="••••••••" />
      </div>
      <button className="auth-btn">حفظ كلمة المرور</button>
    </div>
  );
};

export default NewPassword;