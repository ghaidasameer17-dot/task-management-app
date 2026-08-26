import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Moon, Globe, Archive, Tag, Lock, LogOut, ChevronLeft, Check } from 'lucide-react';
import './Settings.css';
import '../components/CategoryModals.css';

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [emailReminder, setEmailReminder] = useState(
    localStorage.getItem('pref_email_reminder') !== 'false'
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('pref_dark_mode') === 'true'
  );
  const [language, setLanguage] = useState(localStorage.getItem('pref_language') || 'ar');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleEmailReminder = () => {
    const next = !emailReminder;
    setEmailReminder(next);
    localStorage.setItem('pref_email_reminder', String(next));
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('pref_dark_mode', String(next));
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

  return (
    <div className="settings-container">
      <div className="settings-header">
        <ArrowRight size={22} className="settings-back" onClick={() => navigate('/tasks')} />
        <h2>الإعدادات</h2>
        <span style={{ width: 22 }} />
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{user.name ? user.name[0] : '؟'}</div>
        <div className="profile-info">
          <div className="profile-name">{user.name || 'مستخدم'}</div>
          <div className="profile-email">{user.email || ''}</div>
        </div>
        <button className="profile-edit-btn">تعديل</button>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">التنبيهات</div>
        <div className="settings-row">
          <label className="switch">
            <input type="checkbox" checked={emailReminder} onChange={toggleEmailReminder} />
            <span className="slider" />
          </label>
          <div className="settings-row-text">
            <div className="settings-row-title">تذكير بالبريد الإلكتروني</div>
            <div className="settings-row-sub">قبل موعد المهمة بـ 24 ساعة</div>
          </div>
          <Bell size={18} className="settings-row-icon" />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">التخصيصات</div>
        <div className="settings-row">
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider" />
          </label>
          <div className="settings-row-text">
            <div className="settings-row-title">الوضع الداكن</div>
          </div>
          <Moon size={18} className="settings-row-icon" />
        </div>
        <div className="settings-row settings-row-link lang-row" onClick={() => setShowLanguagePopup(true)}>
          <ChevronLeft size={16} className="settings-row-chevron" />
          <div className="settings-row-text">
            <div className="settings-row-title">{LANGUAGES.find((l) => l.code === language)?.label}</div>
          </div>
          <Globe size={18} className="settings-row-icon" />
          <div className="settings-row-label">اللغة</div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">المحتوى</div>
        <div className="settings-row settings-row-link" onClick={() => navigate('/archive')}>
          <ChevronLeft size={16} className="settings-row-chevron" />
          <div className="settings-row-text">
            <div className="settings-row-title">الأرشيف</div>
          </div>
          <Archive size={18} className="settings-row-icon" />
        </div>
        <div className="settings-row settings-row-link" onClick={() => navigate('/categories')}>
          <ChevronLeft size={16} className="settings-row-chevron" />
          <div className="settings-row-text">
            <div className="settings-row-title">إدارة الفئات</div>
          </div>
          <Tag size={18} className="settings-row-icon" />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">الحساب</div>
        <div className="settings-row settings-row-link" onClick={() => navigate('/forgot-password')}>
          <ChevronLeft size={16} className="settings-row-chevron" />
          <div className="settings-row-text">
            <div className="settings-row-title">تغيير كلمة المرور</div>
          </div>
          <Lock size={18} className="settings-row-icon" />
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={16} /> تسجيل الخروج
      </button>

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
    </div>
  );
};

export default Settings;
