import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode } from '../api/auth';

const ResetCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [serverError, setServerError] = useState('');
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

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

      <div className="resend">
        <p>لم يصلك الرمز؟</p>
        {seconds > 0 ? (
          <span>إعادة الإرسال بعد {seconds} ثانية</span>
        ) : (
          <span className="resend-active">إعادة الإرسال</span>
        )}
      </div>

      <button className="auth-btn" onClick={handleVerify}>تأكيد الرمز</button>
    </div>
  );
};

export default ResetCode;