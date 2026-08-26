import { useState } from 'react';
import { Check, Plus } from 'lucide-react';

const priorityLabel = (p) => {
  if (p === 'urgent') return 'عاجل';
  if (p === 'medium') return 'متوسط';
  if (p === 'not_urgent') return 'غير عاجل';
  return 'أولوية';
};

const TaskAttributeChips = ({
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  dueTime,
  onDueTimeChange,
  categoryId,
  onCategoryChange,
  categories,
  onRequestNewCategory,
}) => {
  const [showPriority, setShowPriority] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showTimeField, setShowTimeField] = useState(!!dueTime);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const todayInputValue = new Date().toISOString().slice(0, 10);

  const selectPriority = (p) => {
    onPriorityChange(p);
    setShowPriority(false);
  };

  const selectCategory = (id) => {
    onCategoryChange(id);
    setShowCategory(false);
  };

  const dateChipLabel = () => {
    if (!dueDate) return 'تاريخ';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dueDate);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
    let label;
    if (diff === 0) label = 'اليوم';
    else if (diff === 1) label = 'غدًا';
    else label = `${d.getDate()}/${d.getMonth() + 1}`;
    if (dueTime) label += ` · ${dueTime}`;
    return label;
  };

  return (
    <div className="chips-row">
      <div className="chip-wrapper">
        <button
          type="button"
          className={`chip ${priority ? 'chip-active' : ''}`}
          onClick={() => { setShowPriority(!showPriority); setShowDate(false); setShowCategory(false); }}
        >
          ▲ {priority ? priorityLabel(priority) : 'أولوية'}
        </button>

        {showPriority && (
          <div className="popup priority-popup">
            <div className="popup-title">الأولوية</div>
            <div className="popup-item" onClick={() => selectPriority('urgent')}>
              <span className="priority-high">▲</span> عاجل
              {priority === 'urgent' && <Check size={14} className="popup-check" />}
            </div>
            <div className="popup-item" onClick={() => selectPriority('medium')}>
              <span className="priority-mid">▬</span> متوسط
              {priority === 'medium' && <Check size={14} className="popup-check" />}
            </div>
            <div className="popup-item" onClick={() => selectPriority('not_urgent')}>
              <span className="priority-low">▼</span> غير عاجل
              {priority === 'not_urgent' && <Check size={14} className="popup-check" />}
            </div>
            <div className="popup-item" onClick={() => selectPriority(null)}>
              بدون أولوية
              {!priority && <Check size={14} className="popup-check" />}
            </div>
          </div>
        )}
      </div>

      <div className="chip-wrapper">
        <button
          type="button"
          className={`chip ${categoryId ? 'chip-active' : ''}`}
          onClick={() => { setShowCategory(!showCategory); setShowPriority(false); setShowDate(false); }}
        >
          🏷 {categoryId && categoryMap[categoryId] ? categoryMap[categoryId].name : 'فئة'}
        </button>

        {showCategory && (
          <div className="popup category-popup">
            <div className="popup-title">اختيار الفئة</div>
            <div className="cat-picker-grid">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`cat-pick-chip ${categoryId === c.id ? 'cat-pick-active' : ''}`}
                  onClick={() => selectCategory(c.id)}
                >
                  <span className="group-dot" style={{ background: c.color }} /> {c.name}
                  {categoryId === c.id && <Check size={12} />}
                </button>
              ))}
            </div>
            <div className="popup-item" onClick={() => selectCategory(null)}>
              بدون فئة
              {!categoryId && <Check size={14} className="popup-check" />}
            </div>
            <div className="popup-add-link" onClick={() => { setShowCategory(false); onRequestNewCategory(); }}>
              <Plus size={14} /> فئة جديدة
            </div>
          </div>
        )}
      </div>

      <div className="chip-wrapper">
        <button
          type="button"
          className={`chip ${dueDate ? 'chip-active' : ''}`}
          onClick={() => { setShowDate(!showDate); setShowPriority(false); setShowCategory(false); }}
        >
          📅 {dateChipLabel()}
        </button>

        {showDate && (
          <div className="popup date-popup">
            <div className="popup-title">تحديد التاريخ</div>
            <div className="popup-item" onClick={() => onDueDateChange(todayInputValue)}>
              اليوم
              {dueDate === todayInputValue && <Check size={14} className="popup-check" />}
            </div>
            <div className="popup-item" onClick={() => {
              const t = new Date();
              t.setDate(t.getDate() + 1);
              onDueDateChange(t.toISOString().slice(0, 10));
            }}>غدًا</div>
            <div className="popup-item">
              <input
                type="date"
                value={dueDate || ''}
                onChange={(e) => onDueDateChange(e.target.value || null)}
              />
            </div>

            <div className="date-time-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showTimeField}
                  onChange={() => {
                    const next = !showTimeField;
                    setShowTimeField(next);
                    if (!next) onDueTimeChange(null);
                  }}
                />
                <span className="slider" />
              </label>
              <span>تحديد وقت</span>
            </div>

            {showTimeField && (
              <input
                type="time"
                className="popup-time-input"
                value={dueTime || ''}
                onChange={(e) => onDueTimeChange(e.target.value || null)}
              />
            )}
            {showTimeField && dueTime && (
              <p className="popup-hint">🔔 سيصلك تذكير قبل موعد المهمة</p>
            )}

            <div className="popup-item" onClick={() => { onDueDateChange(null); onDueTimeChange(null); setShowTimeField(false); setShowDate(false); }}>
              بدون تاريخ
            </div>
            <button type="button" className="popup-done-btn" onClick={() => setShowDate(false)}>تم</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAttributeChips;
