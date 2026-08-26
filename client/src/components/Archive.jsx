import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Settings as SettingsIcon, Archive as ArchiveIcon, Trash2 } from 'lucide-react';
import './Archive.css';
import { getTasks, clearArchive } from '../api/tasks';
import { getCategories } from '../api/categories';
import ConfirmDialog from './ConfirmDialog';

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const dayLabel = (date) => `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;

const formatTime = (task, daysAgo) => {
  if (daysAgo === 0) return 'اليوم';
  if (daysAgo === 1) return 'أمس';
  if (!task.completed_at) return '';
  const d = new Date(task.completed_at);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const suffix = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${m}${suffix}`;
};

const Archive = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);

  const load = async () => {
    try {
      const [taskData, catData] = await Promise.all([getTasks(), getCategories()]);
      setTasks(taskData.filter((t) => t.is_completed));
      setCategories(catData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const init = async () => { await load(); };
    init();
  }, []);

  const handleClearArchive = async () => {
    try {
      setError('');
      await clearArchive();
      setConfirmingClear(false);
      load();
    } catch (err) {
      setConfirmingClear(false);
      setError(err.message);
    }
  };

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = [];
  const bucketIndex = {};

  const addToBucket = (label, order, task, daysAgo) => {
    if (!(label in bucketIndex)) {
      bucketIndex[label] = { label, order, days: {} };
      buckets.push(bucketIndex[label]);
    }
    const bucket = bucketIndex[label];
    const completedDate = new Date(task.completed_at);
    completedDate.setHours(0, 0, 0, 0);
    const dayKey = completedDate.toISOString().slice(0, 10);
    if (!(dayKey in bucket.days)) {
      bucket.days[dayKey] = { date: completedDate, tasks: [] };
    }
    bucket.days[dayKey].tasks.push({ ...task, daysAgo });
  };

  [...tasks]
    .filter((t) => t.completed_at)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .forEach((task) => {
      const completedDate = new Date(task.completed_at);
      completedDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.round((today - completedDate) / (1000 * 60 * 60 * 24));
      const sameYear = completedDate.getFullYear() === today.getFullYear();

      if (daysAgo <= 7) {
        addToBucket('الأسبوع الماضي', 0, task, daysAgo);
      } else if (daysAgo <= 30) {
        addToBucket('الـ30 يومًا الماضية', 1, task, daysAgo);
      } else if (sameYear) {
        addToBucket(MONTHS[completedDate.getMonth()], 2 + completedDate.getMonth(), task, daysAgo);
      } else {
        addToBucket(`بقية ${completedDate.getFullYear()}`, 100 - completedDate.getFullYear(), task, daysAgo);
      }
    });

  buckets.sort((a, b) => a.order - b.order);

  return (
    <div className="archive-container">
      <div className="archive-header">
        <ArrowRight size={22} className="archive-back" onClick={() => navigate('/tasks')} />
        <div className="archive-title-block">
          <h2>الأرشيف</h2>
          <p className="archive-sub">
            {tasks.length} مهام مؤرشفة · <span onClick={() => navigate('/settings')}>إعداد الأرشيف</span>
          </p>
        </div>
        <SettingsIcon size={20} className="archive-settings" onClick={() => navigate('/settings')} />
      </div>

      {error && <p className="archive-error">{error}</p>}

      {buckets.map((bucket) => (
        <div key={bucket.label} className="archive-bucket">
          <h3 className="archive-bucket-title">{bucket.label}</h3>
          {Object.values(bucket.days)
            .sort((a, b) => b.date - a.date)
            .map((day) => (
              <div key={day.date.toISOString()} className="archive-day">
                <div className="archive-day-title">{dayLabel(day.date)}</div>
                {day.tasks.map((task) => {
                  const cat = categoryMap[task.category_id];
                  return (
                    <div key={task.id} className="archive-row">
                      <span className="archive-check">✓</span>
                      <span className="archive-task-title">{task.title}</span>
                      {cat && (
                        <span className="archive-cat" style={{ background: `${cat.color}22`, color: cat.color }}>
                          {cat.name}
                        </span>
                      )}
                      <span className="archive-time">{formatTime(task, task.daysAgo)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      ))}

      {tasks.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <ArchiveIcon size={34} strokeWidth={1.8} />
          </div>
          <h3 className="empty-title">الأرشيف فارغ</h3>
          <p className="empty-text">تؤرشف المهام المكتملة تلقائيًا نهاية كل أسبوع وتظهر هنا.</p>
        </div>
      )}

      {tasks.length > 0 && (
        <button className="archive-clear-link" onClick={() => setConfirmingClear(true)}>
          <Trash2 size={14} /> إفراغ الأرشيف
        </button>
      )}

      {confirmingClear && (
        <ConfirmDialog
          icon={<ArchiveIcon size={22} />}
          title="إفراغ الأرشيف؟"
          description={`سيتم حذف ${tasks.length} مهام مؤرشفة نهائيًا. مهامك الحالية لن تتأثر.`}
          confirmLabel="إفراغ"
          onConfirm={handleClearArchive}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  );
};

export default Archive;
