
const Login = () => {
  return (<div>
    <h2>تسجيل الدخول </h2>
    <h1>سجل دخولك لمتابعة مهامك</h1>

    <label htmlFor="email">البريد الالكتروني</label>
<input id="email" type="email" placeholder="example@gmail.com " required />
<label htmlFor="password">كلمة المرور</label>
<input type="password" name="password" id="password" placeholder="********" />

<a href="#">نسيت كلمة المرور؟</a>
<button>تسجيل الدخول</button>
<p>
ليس لديك حساب؟<span>انشاء حساب</span>
</p>







  </div>
  )
}

export default Login

