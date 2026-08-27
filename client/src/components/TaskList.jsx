import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Check, Plus, Trash2, ChevronDown } from 'lucide-react';
import './TaskList.css';
import { getTasks, createTask, toggleTask, deleteTask, updateTask } from '../api/tasks';
import { getCategories } from '../api/categories';
import NewCategoryModal from './NewCategoryModal';
import ConfirmDialog from './ConfirmDialog';
import TaskAttributeChips from './TaskAttributeChips';
import TaskRow from './TaskRow';

const SORT_OPTIONS = [
  { mode: 'date', label: 'التاريخ (الافتراضي)', desc: 'سيتم ترتيب المهام حسب تاريخ الاستحقاق' },
  { mode: 'priority', label: 'الأولوية', desc: 'سيتم ترتيب المهام حسب مستوى الأولوية' },
  { mode: 'category', label: 'الفئة', desc: 'سيتم ترتيب المهام حسب الفئة' },
];

const emptyEditState = { title: '', priority: null, dueDate: null, dueTime: null, categoryId: null, saving: false, error: '' };

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
  const [priority, setPriority] = useState(null);        // الأولوية المختارة
  const [dueDate, setDueDate] = useState(null);           // تاريخ الاستحقاق المختار
  const [dueTime, setDueTime] = useState(null);           // وقت الاستحقاق المختار
  const [categoryId, setCategoryId] = useState(null);     // الفئة المختارة
  const [showSort, setShowSort] = useState(false);        // إظهار/إخفاء قائمة الترتيب
  const [groupMode, setGroupMode] = useState('date');     // طريقة التجميع: date/category/priority
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editState, setEditState] = useState(emptyEditState);
  const [deleteTarget, setDeleteTarget] = useState(null); // المهمة المطلوب تأكيد حذفها
  const [quickAddKey, setQuickAddKey] = useState(0);       // لإعادة تصفير شرائح الإضافة السريعة بعد كل إضافة
  const [showCompleted, setShowCompleted] = useState(false); // إظهار/إخفاء قائمة المكتملة (العدد يبقى ظاهر دائمًا)
  const titleInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // جلب المهام عند فتح الشاشة
  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadTasks(), loadCategories()]);
    };
    init();
  }, []);

  // إضافة مهمة
  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await createTask({ title: newTitle, priority, due_date: dueDate, due_time: dueTime, category_id: categoryId });
      setNewTitle('');
      setPriority(null);
      setDueDate(null);
      setDueTime(null);
      setCategoryId(null);
      setQuickAddKey((k) => k + 1); // إعادة تصفير حالة شرائح الإضافة (مثل مفتاح تحديد الوقت)
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

  // بدء التعديل الداخلي لمهمة
  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditState({
      title: task.title,
      priority: task.priority,
      dueDate: task.due_date ? task.due_date.slice(0, 10) : null,
      dueTime: task.due_time ? task.due_time.slice(0, 5) : null,
      categoryId: task.category_id,
      saving: false,
      error: '',
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditState(emptyEditState);
  };

  const changeEditField = (field, value) => {
    setEditState((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editState.title.trim() || editState.saving) return;
    setEditState((prev) => ({ ...prev, saving: true, error: '' }));
    try {
      await updateTask(editingTaskId, {
        title: editState.title,
        priority: editState.priority,
        due_date: editState.dueDate,
        due_time: editState.dueTime,
        category_id: editState.categoryId,
      });
      cancelEdit();
      loadTasks();
    } catch {
      setEditState((prev) => ({ ...prev, saving: false, error: 'فشل الحفظ' }));
    }
  };

  // حذف
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id);
      if (editingTaskId === deleteTarget.id) cancelEdit();
      setDeleteTarget(null);
      loadTasks();
    } catch (err) {
      setDeleteTarget(null);
      setError(err.message);
    }
  };

  // تحديد المجموعة الزمنية للمهمة (FR-08)
  const getDateGroup = (task) => {
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

  // بداية الأسبوع الحالي (الأحد ٠٠:٠٠) — أساس تجميع "مكتملة هذا الأسبوع"
  const getWeekStart = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
  };

  // المهام النشطة (غير المكتملة) مجمّعة
  const activeTasks = tasks.filter((t) => !t.is_completed);
  // مكتملة هذا الأسبوع فقط — القديمة تتدحرج تلقائيًا للأرشيف بمجرد ما يبدأ أسبوع جديد
  const weekStart = getWeekStart();
  const completedTasks = tasks.filter(
    (t) => t.is_completed && t.completed_at && new Date(t.completed_at) >= weekStart
  );

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  // بناء المجموعات حسب طريقة التجميع الحالية
  const buildGroups = () => {
    if (groupMode === 'date') {
      const groups = {
        today: { label: 'اليوم', tasks: [] },
        tomorrow: { label: 'غدًا', tasks: [] },
        someday: { label: 'يومًا ما', tasks: [] },
        scheduled: { label: 'مجدولة', tasks: [] },
      };
      activeTasks.forEach((t) => groups[getDateGroup(t)].tasks.push(t));
      return ['today', 'tomorrow', 'someday', 'scheduled']
        .map((key) => ({ key, ...groups[key] }))
        .filter((g) => g.tasks.length > 0);
    }

    if (groupMode === 'category') {
      const groups = {};
      categories.forEach((c) => {
        groups[c.id] = { key: String(c.id), label: c.name, dot: c.color, tasks: [] };
      });
      const noCategory = { key: 'none', label: 'بدون فئة', tasks: [] };
      activeTasks.forEach((t) => {
        if (t.category_id && groups[t.category_id]) groups[t.category_id].tasks.push(t);
        else noCategory.tasks.push(t);
      });
      return [...Object.values(groups), noCategory].filter((g) => g.tasks.length > 0);
    }

    // priority
    const groups = {
      urgent: { key: 'urgent', label: 'عاجل', icon: '▲', iconClass: 'priority-high', tasks: [] },
      medium: { key: 'medium', label: 'متوسط', icon: '▬', iconClass: 'priority-mid', tasks: [] },
      not_urgent: { key: 'not_urgent', label: 'غير عاجل', icon: '▼', iconClass: 'priority-low', tasks: [] },
      none: { key: 'none', label: 'بدون أولوية', tasks: [] },
    };
    activeTasks.forEach((t) => {
      groups[t.priority || 'none'].tasks.push(t);
    });
    return ['urgent', 'medium', 'not_urgent', 'none'].map((key) => groups[key]).filter((g) => g.tasks.length > 0);
  };

  const groups = buildGroups();

  const selectSort = (mode) => {
    setGroupMode(mode);
    setShowSort(false);
  };

  const handleCategoryCreated = (cat) => {
    setCategories((prev) => [...prev, cat]);
    if (editingTaskId) {
      changeEditField('categoryId', cat.id);
    } else {
      setCategoryId(cat.id);
    }
    setShowNewCategoryModal(false);
  };

  const isEmpty = activeTasks.length === 0 && completedTasks.length === 0;

  return (
    <div className="task-container">
      {/* الهيدر */}
      <div className="task-header">
        <div className="chip-wrapper">
          <span className="header-sort" onClick={() => setShowSort(!showSort)} title="ترتيب حسب">⇅</span>
          {showSort && (
            <div className="popup sort-popup">
              <div className="popup-title">ترتيب حسب</div>
              {SORT_OPTIONS.map((opt) => (
                <div key={opt.mode} className="popup-item sort-item" onClick={() => selectSort(opt.mode)}>
                  <div className="sort-item-row">
                    {groupMode === opt.mode && <Check size={14} />}
                    <span>{opt.label}</span>
                  </div>
                  {groupMode === opt.mode && <span className="sort-item-desc">{opt.desc}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <h2>كل المهام</h2>
        <span className="header-avatar" onClick={() => navigate('/settings')}>
          {user.name ? user.name[0] : 'غ'}
        </span>
      </div>

      {error && <p className="task-error">{error}</p>}

      {isEmpty ? (
        /* حالة القائمة الفارغة تمامًا */
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <ClipboardList size={36} strokeWidth={1.8} />
            <span className="empty-badge"><Check size={13} strokeWidth={3} /></span>
          </div>
          <h3 className="empty-title">قائمتك فارغة</h3>
          <p className="empty-text">لا توجد مهام حاليًا. أضف أول مهمة لتبدأ التنظيم.</p>
          <button className="empty-add-btn" onClick={() => titleInputRef.current?.focus()}>
            إضافة أول مهمة <Plus size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* المجموعات */}
          {groups.map((group) => (
            <div key={group.key} className="task-group">
              <div className="group-header">
                <span className="group-add">+</span>
                <h3 className="group-title">
                  {group.dot && <span className="group-dot" style={{ background: group.dot }} />}
                  {group.icon && <span className={group.iconClass}>{group.icon} </span>}
                  {group.label}
                </h3>
              </div>
              {group.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  cat={categoryMap[task.category_id]}
                  onToggle={handleToggle}
                  onStartEdit={startEdit}
                  onDeleteRequest={setDeleteTarget}
                  isEditing={editingTaskId === task.id}
                  editState={editState}
                  onEditChange={changeEditField}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  categories={categories}
                  onRequestNewCategory={() => setShowNewCategoryModal(true)}
                />
              ))}
            </div>
          ))}

          {/* قسم المكتملة */}
          <div className="completed-section">
            <div className="completed-header" onClick={() => setShowCompleted((v) => !v)}>
              <h3 className="completed-title">مكتملة هذا الأسبوع ({completedTasks.length})</h3>
              <ChevronDown size={16} className={`completed-chevron ${showCompleted ? 'completed-chevron-open' : ''}`} />
            </div>
            {showCompleted && (
              completedTasks.length === 0 ? (
                <div className="empty-sub-state">
                  <div className="empty-sub-icon"><Check size={22} strokeWidth={2.5} /></div>
                  <p className="empty-sub-title">لا توجد مهام مكتملة هذا الأسبوع</p>
                  <p className="empty-sub-text">المهام التي تكملها ستظهر هنا</p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="task-row completed">
                    <span
                      className="task-check checked"
                      onClick={() => handleToggle(task.id)}
                    >✓</span>
                    <span className="task-title done">{task.title}</span>
                  </div>
                ))
              )
            )}
          </div>
        </>
      )}

      {/* منطقة الإضافة السريعة */}
      <div className="quick-add-area">
        <TaskAttributeChips
          key={quickAddKey}
          priority={priority}
          onPriorityChange={setPriority}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
          dueTime={dueTime}
          onDueTimeChange={setDueTime}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          categories={categories}
          onRequestNewCategory={() => setShowNewCategoryModal(true)}
        />

        {/* حقل الإدخال */}
        <div className="quick-add">
          <button className="quick-add-btn" onClick={handleAdd}>+</button>
          <input
            ref={titleInputRef}
            type="text"
            placeholder="أريد أن..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
      </div>

      {showNewCategoryModal && (
        <NewCategoryModal
          onCancel={() => setShowNewCategoryModal(false)}
          onCreated={handleCategoryCreated}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          icon={<Trash2 size={22} />}
          title="حذف المهمة؟"
          description={<>«{deleteTarget.title}»<br />لا يمكن التراجع عن هذا الإجراء</>}
          confirmLabel="حذف"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
