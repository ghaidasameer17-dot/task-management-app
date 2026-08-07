import Login from "./components/Login";
import Signup from "./components/Signup";
import EmailVerification from "./components/EmailVerification"
import ForgotPassword from "./components/ForgotPassword"
import ResetCode from "./components/ResetCode"
import NewPassword from "./components/NewPassword"
import PasswordChanged from "./components/PasswordChanged"
function App() {
  return (
    <div>
      <Login />
      <Signup />
      <EmailVerification/>
      <ForgotPassword/>
      <ResetCode/>
      <NewPassword/>
      <PasswordChanged/>
    </div>
  );
}

export default App;
