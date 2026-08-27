import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from "./components/ForgotPassword";
import ResetCode from "./components/ResetCode";
import NewPassword from "./components/NewPassword";
import PasswordChanged from "./components/PasswordChanged";
import TaskList from "./components/TaskList";
import AccountVerified from "./components/AccountVerified";
import Settings from "./components/Settings";
import Archive from "./components/Archive";
import Categories from "./components/Categories";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-code" element={<ResetCode />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/password-changed" element={<PasswordChanged />} />
      <Route path="/account-verified" element={<AccountVerified />} />
      <Route path="/tasks" element={<ProtectedRoute><AppShell><TaskList /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/archive" element={<ProtectedRoute><AppShell><Archive /></AppShell></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><AppShell><Categories /></AppShell></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
