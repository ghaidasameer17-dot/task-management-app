import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ListChecks, Inbox, Tag, Moon, Globe, Pencil, Lock, LogOut, Check } from 'lucide-react';
import './Sidebar.css';
import './CategoryModals.css';
import { forgotPassword } from '../api/auth';

const NAV_ITEMS = [
  { to: '/tasks', label: 'كل المهام', icon: ListChecks },
  { to: '/archive', label: 'الأرشيف', icon: Inbox },
  { to: '/categories', label: 'إدارة الفئات', icon: Tag },
];

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [emailReminder, setEmailReminder] = useState(
    localStorage.getItem('pref_email_reminder') !== 'false'
  );
  const [language, setLanguage] = useState(localStorage.getItem('pref_language') || 'ar');
  const [error, setError] = useState('');

  const toggleEmailReminder = () => {
    const next = !emailReminder;
    setEmailReminder(next);
    localStorage.setItem('pref_email_reminder', String(next));
  };

  const selectLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem('pref_language', code);
    setShowLanguagePopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // نرسل رمز التحقق للبريد المعروف مباشرة وننتقل لشاشة إدخاله، بدون ما نطلب من المستخدم كتابة بريده من جديد
  const handleChangePassword = async () => {
    try {
      setError('');
      await forgotPassword({ email: user.email });
      setShowProfileMenu(false);
      navigate('/reset-code', { state: { email: user.email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>مهامي</span>
          <CheckCircle2 size={22} className="sidebar-brand-icon" />
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <div
                key={item.to}
                className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => navigate(item.to)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user-row">
            <div className="sidebar-user" onClick={() => setShowProfileMenu((v) => !v)}>
              <div className="sidebar-avatar">{user.name ? user.name[0] : '؟'}</div>
              <span className="sidebar-user-name">{user.name || 'مستخدم'}</span>
            </div>
            <div className="sidebar-icon-btns">
              <Moon size={17} />
              <Globe size={17} onClick={() => setShowLanguagePopup(true)} />
            </div>
          </div>

          {showProfileMenu && (
            <div className="sidebar-profile-popup">
              <div className="sidebar-profile-item">
                <Pencil size={14} /> تعديل الاسم
              </div>
              <div
                className="sidebar-profile-item"
                onClick={handleChangePassword}
              >
                <Lock size={14} /> تغيير كلمة المرور
              </div>
              {error && <p className="sidebar-profile-error">{error}</p>}
              <div className="sidebar-profile-item sidebar-profile-toggle">
                <label className="switch">
                  <input type="checkbox" checked={emailReminder} onChange={toggleEmailReminder} />
                  <span className="slider" />
                </label>
                <span>تذكيرات بريدية</span>
              </div>
              <div className="sidebar-profile-item sidebar-profile-logout" onClick={handleLogout}>
                <LogOut size={14} /> تسجيل الخروج
              </div>
            </div>
          )}
        </div>
      </aside>

      {showLanguagePopup && (
        <div className="modal-backdrop" onClick={() => setShowLanguagePopup(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">اللغة</h3>
            {LANGUAGES.map((l) => (
              <div key={l.code} className="lang-option" onClick={() => selectLanguage(l.code)}>
                <span>{l.label}</span>
                {language === l.code && <Check size={16} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
