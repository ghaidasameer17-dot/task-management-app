import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import TaskAttributeChips from './TaskAttributeChips';

const priorityClass = (p) => {
  if (p === 'urgent') return 'priority-high';
  if (p === 'medium') return 'priority-mid';
  if (p === 'not_urgent') return 'priority-low';
  return '';
};

const formatDate = (task) => {
  if (!task.due_date) return '';
  const d = new Date(task.due_date);
  let str = `${d.getDate()}/${d.getMonth() + 1}`;
  if (task.due_time) str += ` · ${task.due_time.slice(0, 5)}`;
  return str;
};

const TaskRow = ({
  task,
  cat,
  onToggle,
  onStartEdit,
  onDeleteRequest,
  isEditing,
  editState,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  categories,
  onRequestNewCategory,
}) => {
  if (isEditing) {
    const disabled = !editState.title.trim() || editState.saving;
    return (
      <div className="task-row task-row-editing">
        <input
          className="edit-title-input"
          value={editState.title}
          onChange={(e) => onEditChange('title', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
          autoFocus
        />
        <TaskAttributeChips
          priority={editState.priority}
          onPriorityChange={(p) => onEditChange('priority', p)}
          dueDate={editState.dueDate}
          onDueDateChange={(d) => onEditChange('dueDate', d)}
          dueTime={editState.dueTime}
          onDueTimeChange={(t) => onEditChange('dueTime', t)}
          categoryId={editState.categoryId}
          onCategoryChange={(id) => onEditChange('categoryId', id)}
          categories={categories}
          onRequestNewCategory={onRequestNewCategory}
        />

        {editState.error ? (
          <div className="save-fail-banner">
            <AlertTriangle size={14} />
            <span>تعذّر الحفظ — تحقق من الاتصال</span>
            <button type="button" onClick={onSaveEdit}>إعادة المحاولة</button>
          </div>
        ) : (
          <div className="edit-actions">
            <button
              type="button"
              className={`edit-save-btn ${!editState.title.trim() ? 'edit-save-btn-disabled' : ''} ${editState.saving ? 'edit-save-btn-loading' : ''}`}
              disabled={disabled}
              onClick={onSaveEdit}
            >
              {editState.saving && <span className="btn-spinner" />}
              {editState.saving ? 'جار الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="edit-cancel-btn" onClick={onCancelEdit}>إلغاء</button>
            <button type="button" className="edit-delete-btn" onClick={() => onDeleteRequest(task)}>
              <Trash2 size={14} /> حذف
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="task-row task-row-hoverable">
      <span className="task-check" onClick={() => onToggle(task.id)}></span>
      {task.priority && (
        <span className={`task-priority ${priorityClass(task.priority)}`}>▲</span>
      )}
      <span className="task-title" onClick={() => onStartEdit(task)}>
        {task.title}
      </span>
      {cat && (
        <span className="task-cat" style={{ background: `${cat.color}22`, color: cat.color }}>
          {cat.name}
        </span>
      )}
      {task.due_date && <span className="task-date">{formatDate(task)}</span>}
      <span className="task-row-actions">
        <Pencil size={15} onClick={() => onStartEdit(task)} />
        <Trash2 size={15} onClick={() => onDeleteRequest(task)} />
      </span>
    </div>
  );
};

export default TaskRow;
