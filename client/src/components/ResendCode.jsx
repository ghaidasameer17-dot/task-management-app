import { useState, useEffect } from 'react';

const ResendCode = ({ onResend }) => {
  const [seconds, setSeconds] = useState(60);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const ready = seconds === 0 && !sent;

  const handleClick = async () => {
    if (!ready || sending) return;
    try {
      setSending(true);
      setError('');
      await onResend();
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="resend">
      <p>لم يصلك الرمز؟</p>
      {!ready && !sent && <span>إعادة الإرسال بعد {seconds} ثانية</span>}
      {ready && (
        <span className="resend-active" role="button" tabIndex={0} onClick={handleClick}>
          {sending ? 'جارٍ الإرسال...' : 'إعادة إرسال الرمز'}
        </span>
      )}
      {sent && (
        <span className="resend-sent">✓ تم إرسال رمز جديد إلى بريدك</span>
      )}
      {error && <p className="resend-error">{error}</p>}
    </div>
  );
};

export default ResendCode;
