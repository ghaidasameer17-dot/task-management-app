import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import './Login.css';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);   
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [name, setName] = useState('');
const [nameError, setNameError] = useState('');

const [password, setPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

const [confirm, setConfirm] = useState('');
const [confirmError, setConfirmError] = useState('');

 const handleSignup = () => {
  // الاسم
  if (!name) {
    setNameError('الاسم مطلوب');
  } else {
    setNameError('');
  }

  // الإيميل
  if (!email) {
    setEmailError('البريد الإلكتروني مطلوب');
  } else if (!email.includes('@')) {
    setEmailError('صيغة البريد الإلكتروني غير صحيحة');
  } else {
    setEmailError('');
  }

  // كلمة المرور
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
      <div className="auth-header">
        <h2>إنشاء حساب</h2>
        <p>أدخل بياناتك للبدء في تنظيم مهامك</p>
      </div>

      <div className="form-group">
        <label htmlFor="name">الاسم</label>
        <input id="name" type="text" placeholder="مثال: غيداء المحمادي" className="input-error"
        value={name}
onChange={(e) => setName(e.target.value)}
className={nameError ? 'input-error' : ''} />
{nameError && <span className="error-text">⚠ {nameError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={emailError ? 'input-error' : ''}
        />
        {emailError && <span className="error-text">⚠ {emailError}</span>}
      </div>

      <div className="form-group">
  <label htmlFor="password">كلمة المرور</label>

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
  <label htmlFor="confirm">تأكيد كلمة المرور</label>

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

  {confirmError && <span className="error-text">⚠ {confirmError}</span>}
</div>

      <button className="auth-btn" onClick={handleSignup}>إنشاء حساب</button>

      <p className="auth-text">
        لديك حساب؟<span>تسجيل الدخول</span>
      </p>
    </div>
  );
};

export default Signup;