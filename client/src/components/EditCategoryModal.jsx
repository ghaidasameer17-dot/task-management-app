import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ColorWheel from './ColorWheel';
import ConfirmDialog from './ConfirmDialog';
import { updateCategory, deleteCategory } from '../api/categories';
import './CategoryModals.css';

const EditCategoryModal = ({ category, taskCount = 0, onCancel, onSaved, onDeleted }) => {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [hexInput, setHexInput] = useState(category.color);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // العجلة تحدّث اللون وحقل الهيكس معًا مباشرة (بدون الحاجة لأثر تزامن منفصل)
  const handleWheelChange = (newColor) => {
    setColor(newColor);
    setHexInput(newColor);
  };

  const commitHex = () => {
    if (/^#?[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setColor(hexInput.startsWith('#') ? hexInput.toUpperCase() : `#${hexInput.toUpperCase()}`);
    } else {
      setHexInput(color);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setError('');
      const updated = await updateCategory(category.id, { name: name.trim(), color });
      onSaved(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await deleteCategory(category.id);
      onDeleted(category.id);
    } catch (err) {
      setConfirmingDelete(false);
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title"><Pencil size={15} /> تعديل</h3>
          <span className="modal-delete-link" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={14} /> حذف الفئة
          </span>
        </div>
        {error && <p className="modal-error">{error}</p>}
        <label className="modal-label">اسم الفئة</label>
        <input
          className="modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <label className="modal-label">اللون</label>
        <div className="modal-wheel-row">
          <ColorWheel value={color} onChange={handleWheelChange} />
        </div>
        <div className="modal-hex-row">
          <input
            className="modal-hex-input"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onBlur={commitHex}
            onKeyDown={(e) => e.key === 'Enter' && commitHex()}
          />
          <span className="modal-hex-preview" style={{ background: color }} />
        </div>
        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onCancel}>إلغاء</button>
          <button className="modal-btn-primary" onClick={handleSave}>حفظ</button>
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          icon={<Trash2 size={22} />}
          title={`حذف فئة «${category.name}»؟`}
          description={
            taskCount > 0
              ? `ستبقى ${taskCount} مهام بدون فئة. لا يمكن التراجع.`
              : 'لا يمكن التراجع عن هذا الإجراء.'
          }
          confirmLabel="حذف"
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
};

export default EditCategoryModal;
