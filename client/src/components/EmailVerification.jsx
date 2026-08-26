import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../api/auth';
import { useState } from 'react';
import ResendCode from './ResendCode';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [serverError, setServerError] = useState('');

  const handleVerify = async () => {
    if (!code) {
      setServerError('الرجاء إدخال الرمز');
      return;
    }
    try {
      setServerError('');
      await verifyEmail({ email, code });
      // نجح التفعيل → ننتقل لتسجيل الدخول
navigate('/account-verified');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="verify-back">
        <button className="back-btn" onClick={() => navigate('/signup')}>→</button>
      </div>

      <div className="auth-header">
        <h2>تأكيد البريد الإلكتروني</h2>
        <p>أدخل الرمز المكوّن من ٤ أرقام المُرسل إلى</p>
        <span className="verify-email">{email}</span>
      </div>

      {serverError && (
        <div className="error-banner">
          <span>⚠</span>
          <p>{serverError}</p>
        </div>
      )}

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

      <ResendCode onResend={() => resendVerification({ email })} />
      <button className="auth-btn" onClick={handleVerify}>تأكيد</button>
    </div>
  );
};

export default EmailVerification;