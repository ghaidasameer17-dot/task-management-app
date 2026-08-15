import { useNavigate } from 'react-router-dom';

const AccountVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="success-icon"><span>✓</span></div>
      <div className="auth-header">
        <h2>تم تفعيل حسابك</h2>
        <p>يمكنك الآن تسجيل الدخول والبدء في تنظيم مهامك.</p>
      </div>
      <button className="auth-btn" onClick={() => navigate('/')}>تسجيل الدخول</button>
    </div>
  );
};

export default AccountVerified;