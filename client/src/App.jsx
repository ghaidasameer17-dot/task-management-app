import Login from "./components/Login";
import Signup from "./components/Signup";
import EmailVerification from "./components/EmailVerification"
import ForgotPassword from "./components/ForgotPassword"
import ResetCode from "./components/ResetCode"
import NewPassword from "./components/NewPassword"
import PasswordChanged from "./components/PasswordChanged"
import TaskList from "./components/TaskList";

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
      <TaskList/>
    </div>
  );
}

export default App;
