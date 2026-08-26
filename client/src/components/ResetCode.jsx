import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode, forgotPassword } from '../api/auth';
import ResendCode from './ResendCode';

const ResetCode = () => {
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
      await verifyResetCode({ email, code });
      // نجح → ننتقل لشاشة كلمة المرور الجديدة، ونمرر البريد والرمز
      navigate('/new-password', { state: { email, code } });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="verify-back">
        <button className="back-btn" onClick={() => navigate('/forgot-password')}>→</button>
      </div>
      <div className="auth-header">
        <h2>رمز الاستعادة</h2>
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

      <ResendCode onResend={() => forgotPassword({ email })} />

      <button className="auth-btn" onClick={handleVerify}>تأكيد الرمز</button>
    </div>
  );
};

export default ResetCode;