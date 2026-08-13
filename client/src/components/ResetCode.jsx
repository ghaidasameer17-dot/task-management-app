import { useState } from 'react';

const ResetCode = () => {
  const [code, setCode] = useState('');
  return (
    <div className="auth-container">
      <div className="verify-back"><button className="back-btn">→</button></div>
      <div className="auth-header">
        <h2>رمز الاستعادة</h2>
        <p>أدخل الرمز المكوّن من ٦ أرقام المُرسل إلى</p>
        <span className="verify-email">ghaida@example.com</span>
      </div>
      <div className="code-boxes">
       <input
  className="code-input"
  type="text"
  inputMode="numeric"
  maxLength="4"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  placeholder="____"
/>
       
      </div>
      <div className="resend">
        <p>لم يصلك الرمز؟</p>
        <span>إعادة الإرسال بعد ٠٠:٤٥</span>
      </div>
      <button className="auth-btn">تأكيد الرمز</button>
    </div>
  );
};

export default ResetCode;