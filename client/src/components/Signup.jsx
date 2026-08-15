import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import './Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

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

  const handleSignup = async () => {
    // التحقق المحلي أولًا
    let valid = true;

    if (!name) { setNameError('الاسم مطلوب'); valid = false; }
    else { setNameError(''); }

    if (!email) { setEmailError('البريد الإلكتروني مطلوب'); valid = false; }
    else if (!email.includes('@')) { setEmailError('صيغة البريد الإلكتروني غير صحيحة'); valid = false; }
    else { setEmailError(''); }

    if (!password) { setPasswordError('كلمة المرور مطلوبة'); valid = false; }
    else if (password.length < 8) { setPasswordError('كلمة المرور قصيرة — ٨ أحرف على الأقل'); valid = false; }
    else { setPasswordError(''); }

    if (confirm !== password) { setConfirmError('كلمتا المرور غير متطابقتان'); valid = false; }
    else { setConfirmError(''); }

    // لو فيه خطأ محلي، نوقف قبل نداء الباك اند
    if (!valid) return;

    // نداء الباك اند
    try {
      setServerError('');
      await registerUser({ name, email, password });
      // نجح → ننتقل لشاشة التفعيل ونمرر البريد معنا
      navigate('/verify', { state: { email } });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-header">
        <h2>إنشاء حساب</h2>
        <p>أدخل بياناتك للبدء في تنظيم مهامك</p>
      </div>

      {serverError && (
        <div className="error-banner">
          <span>⚠</span>
          <p>{serverError}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">الاسم</label>
        <input id="name" type="text" placeholder="مثال: غيداء المحمادي"
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
        لديك حساب؟<Link to="/">تسجيل الدخول</Link>
      </p>
    </div>
  );
};

export default Signup;