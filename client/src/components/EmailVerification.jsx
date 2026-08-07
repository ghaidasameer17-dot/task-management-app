
const EmailVerification = () => {
  return (
    <div className="auth-container">
      <div className="verify-back">
        <button className="back-btn">→</button>
      </div>

      <div className="auth-header">
        <h2>تأكيد البريد الإلكتروني</h2>
        <p>أدخل الرمز المكوّن من ٦ أرقام المُرسل إلى</p>
        <span className="verify-email">ghaida@example.com</span>
      </div>

      <div className="code-boxes">
        <input className="code-box" maxLength="1" />
        <input className="code-box" maxLength="1" />
        <input className="code-box" maxLength="1" />
        <input className="code-box" maxLength="1" />
        <input className="code-box" maxLength="1" />
        <input className="code-box" maxLength="1" />
      </div>

      <div className="resend">
        <p>لم يصلك الرمز؟</p>
        <span>إعادة الإرسال بعد ٠٠:٤٥</span>
      </div>

      <button className="auth-btn">تأكيد</button>
    </div>
  );
};

export default EmailVerification;