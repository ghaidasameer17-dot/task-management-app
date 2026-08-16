import { useState, useEffect } from 'react';
import './TaskList.css';
import { getTasks, createTask, toggleTask, deleteTask } from '../api/tasks';


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
const [priority, setPriority] = useState(null);        // الأولوية المختارة
const [showPriority, setShowPriority] = useState(false); // إظهار/إخفاء القائمة
  // جلب المهام عند فتح الشاشة
  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // جلب المهام عند فتح الشاشة
 // جلب المهام عند فتح الشاشة
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTasks();
  }, []);
  // إضافة مهمة
  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await createTask({ title: newTitle, priority });
      setNewTitle('');
      setPriority(null);
      loadTasks(); // نعيد الجلب لتحديث القائمة
    } catch (err) {
      setError(err.message);
    }
  };

  // تبديل الإكمال
  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // حذف
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المهمة؟')) return;
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // تحديد المجموعة الزمنية للمهمة (FR-08)
  const getGroup = (task) => {
    if (!task.due_date) return 'someday';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.due_date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'today';   // اليوم أو متأخرة
    if (diffDays === 1) return 'tomorrow';
    return 'scheduled';
  };

  // المهام النشطة (غير المكتملة) مجمّعة
  const activeTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  const groups = {
    today: { label: 'اليوم', tasks: [] },
    tomorrow: { label: 'غدًا', tasks: [] },
    someday: { label: 'يومًا ما', tasks: [] },
    scheduled: { label: 'مجدولة', tasks: [] },
  };
  activeTasks.forEach((t) => groups[getGroup(t)].tasks.push(t));

  // ترتيب عرض المجموعات
  const order = ['today', 'tomorrow', 'someday', 'scheduled'];

  // تنسيق التاريخ للعرض
  const formatDate = (task) => {
    if (!task.due_date) return '';
    const d = new Date(task.due_date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    let str = `${day}/${month}`;
    if (task.due_time) {
      str += ` · ${task.due_time.slice(0, 5)}`;
    }
    return str;
  };

  // خريطة ألوان الأولوية للمثلث
  const priorityClass = (p) => {
    if (p === 'urgent') return 'priority-high';
    if (p === 'medium') return 'priority-mid';
    if (p === 'not_urgent') return 'priority-low';
    return '';
  };

  // اسم الأولوية للعرض
const priorityLabel = (p) => {
  if (p === 'urgent') return 'عاجل';
  if (p === 'medium') return 'متوسط';
  if (p === 'not_urgent') return 'غير عاجل';
  return 'أولوية';
};

// اختيار أولوية وإغلاق القائمة
const selectPriority = (p) => {
  setPriority(p);
  setShowPriority(false);
};

  return (
    <div className="task-container">
      {/* الهيدر */}
      <div className="task-header">
        <span className="header-sort">⇅</span>
        <h2>كل المهام</h2>
        <span className="header-avatar">غ</span>
      </div>

      {error && <p className="task-error">{error}</p>}

      {/* المجموعات الزمنية */}
      {order.map((key) => (
        <div key={key} className="task-group">
          <div className="group-header">
            <span className="group-add">+</span>
            <h3 className="group-title">{groups[key].label}</h3>
          </div>
          {groups[key].tasks.map((task) => (
            <div key={task.id} className="task-row">
              <span
                className="task-check"
                onClick={() => handleToggle(task.id)}
              ></span>
              {task.priority && (
                <span className={`task-priority ${priorityClass(task.priority)}`}>▲</span>
              )}
              <span
                className="task-title"
                onClick={() => handleDelete(task.id)}
              >
                {task.title}
              </span>
              {task.category_id && <span className="task-cat">فئة</span>}
              {task.due_date && <span className="task-date">{formatDate(task)}</span>}
            </div>
          ))}
        </div>
      ))}

      {/* قسم المكتملة */}
      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3 className="completed-title">مكتملة هذا الأسبوع ({completedTasks.length})</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="task-row completed">
              <span
                className="task-check checked"
                onClick={() => handleToggle(task.id)}
              >✓</span>
              <span className="task-title done">{task.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* حقل الإضافة السريعة */}
      {/* منطقة الإضافة السريعة */}
<div className="quick-add-area">
  {/* الشرائح */}
  <div className="chips-row">
    <div className="chip-wrapper">
      <button
        className={`chip ${priority ? 'chip-active' : ''}`}
        onClick={() => setShowPriority(!showPriority)}
      >
        ▲ {priority ? priorityLabel(priority) : 'أولوية'}
      </button>

      {showPriority && (
        <div className="popup">
          <div className="popup-title">الأولوية</div>
          <div className="popup-item" onClick={() => selectPriority('urgent')}>
            <span className="priority-high">▲</span> عاجل
          </div>
          <div className="popup-item" onClick={() => selectPriority('medium')}>
            <span className="priority-mid">▬</span> متوسط
          </div>
          <div className="popup-item" onClick={() => selectPriority('not_urgent')}>
            <span className="priority-low">▼</span> غير عاجل
          </div>
          <div className="popup-item" onClick={() => selectPriority(null)}>
            بدون أولوية
          </div>
        </div>
      )}
    </div>
  </div>

  {/* حقل الإدخال */}
  <div className="quick-add">
    <button className="quick-add-btn" onClick={handleAdd}>+</button>
    <input
      type="text"
      placeholder="أريد أن..."
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
    />
  </div>
</div>
    </div>
  );
};

export default TaskList;