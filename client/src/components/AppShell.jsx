import Sidebar from './Sidebar';
import './AppShell.css';

const AppShell = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="app-shell-main">{children}</main>
  </div>
);

export default AppShell;
