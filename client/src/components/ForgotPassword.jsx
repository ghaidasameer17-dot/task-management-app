import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setServerError('البريد الإلكتروني مطلوب');
      return;
    }
    try {
      setServerError('');
      await forgotPassword({ email });
      // نجح → ننتقل لشاشة إدخال الرمز ونمرر البريد
      navigate('/reset-code', { state: { email } });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="verify-back">
        <button className="back-btn" onClick={() => navigate('/')}>→</button>
      </div>
      <div className="auth-header">
        <h2>نسيت كلمة المرور</h2>
        <p>أدخل بريدك المسجّل وسنرسل إليك رمز الاستعادة</p>
      </div>

      {serverError && (
        <div className="error-banner">
          <span>⚠</span>
          <p>{serverError}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="auth-btn" onClick={handleSend}>إرسال الرمز</button>
      <p className="auth-text">تذكّرت كلمة المرور؟<Link to="/">تسجيل الدخول</Link></p>
    </div>
  );
};

export default ForgotPassword;