import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirm, setConfirm] = useState('');
const [confirmError, setConfirmError] = useState('');


  const handleSave = () => {
    if (!password) {
      setPasswordError('كلمة المرور مطلوبة');
    } else if (password.length < 8) {
      setPasswordError('كلمة المرور قصيرة — ٨ أحرف على الأقل');
    } else {
      setPasswordError('');
    }
     // التأكيد
  if (confirm !== password) {
    setConfirmError('كلمتا المرور غير متطابقتان');
  } else {
    setConfirmError('');
  }
  };

  return (
    <div className="auth-container">
      <div className="verify-back"><button className="back-btn">→</button></div>
      <div className="auth-header">
        <h2>كلمة مرور جديدة</h2>
        <p>اختر كلمة مرور جديدة لحسابك</p>
      </div>

      <div className="form-group">
        <label htmlFor="password">كلمة المرور الجديدة</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? 'input-error' : ''}
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && <span className="error-text">⚠ {passwordError}</span>}
        <span className="helper-text">٨ أحرف على الأقل</span>
      </div>

      <div className="form-group">
        <label htmlFor="confirm">تأكيد كلمة المرور الجديدة</label>

<div className="password-wrapper">
    <input
      id="confirm"
      type={showConfirm ? 'text' : 'password'}
      placeholder="••••••••"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      className={confirmError ? 'input-error' : ''}
    />
    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowConfirm(!showConfirm)}
    >
      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {confirmError && <span className="error-text">⚠ {confirmError}</span>}      </div>

      <button className="auth-btn" onClick={handleSave}>حفظ كلمة المرور</button>
    </div>
  );
};

export default NewPassword;