import "./Login.css";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // تحقق محلي: الحقول غير فارغة
    if (!email || !password) {
      setServerError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }

    try {
      setServerError('');
      const data = await loginUser({ email, password });
      // حفظ التوكن في المتصفح
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // نجح → ننتقل للمهام
      navigate('/tasks');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>تسجيل الدخول </h2>
        <p>سجل دخولك لمتابعة مهامك</p>
      </div>

      {serverError && (
        <div className="error-banner">
          <span>⚠</span>
          <p>{serverError}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">البريد الالكتروني</label>
        <input
          id="email"
          type="email"
          placeholder="example@gmail.com "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">كلمة المرور</label>

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Link to="/forgot-password" className="forgot-link">
        نسيت كلمة المرور؟
      </Link>
      <button className="auth-btn" onClick={handleLogin}>تسجيل الدخول</button>
      <p className="signup-text">
        ليس لديك حساب؟<Link to="/signup">انشاء حساب</Link>
      </p>
    </div>
  );
};

export default Login;