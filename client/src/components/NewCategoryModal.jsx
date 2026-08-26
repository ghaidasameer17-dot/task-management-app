import { useState } from 'react';
import { createCategory } from '../api/categories';
import './CategoryModals.css';

const PRESET_COLORS = ['#2F6FED', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

const NewCategoryModal = ({ onCancel, onCreated }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      setError('');
      const cat = await createCategory({ name: name.trim(), color });
      onCreated(cat);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">فئة جديدة</h3>
        {error && <p className="modal-error">{error}</p>}
        <label className="modal-label">اسم الفئة</label>
        <input
          className="modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          autoFocus
        />
        <label className="modal-label">اللون</label>
        <div className="modal-swatches">
          {PRESET_COLORS.map((c) => (
            <span
              key={c}
              className={`modal-swatch ${color === c ? 'modal-swatch-active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onCancel}>إلغاء</button>
          <button className="modal-btn-primary" onClick={handleAdd}>إضافة</button>
        </div>
      </div>
    </div>
  );
};

export default NewCategoryModal;
