import "./Login.css";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
const Login = () => {
  const [ShowError, setShowError]=useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);   
  const handleLogin =()=>{
    if(!email ||!password ){
    setShowError(true);
    }
    else{
      setShowError(false);

    }
  }
  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>تسجيل الدخول </h2>
        <p>سجل دخولك لمتابعة مهامك</p>
      </div>
      {ShowError&&(
        <div className="error-banner">
        <span>⚠</span>
        <p>البريد الإلكتروني أو كلمة المرور غير صحيحة</p>
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

      <a href="#" className="forgot-link">
        نسيت كلمة المرور؟
      </a>
      <button className="auth-btn" onClick={handleLogin}>تسجيل الدخول</button>
      <p className="signup-text">
        ليس لديك حساب؟<span>انشاء حساب</span>
      </p>
    </div>
  );
};

export default Login;
