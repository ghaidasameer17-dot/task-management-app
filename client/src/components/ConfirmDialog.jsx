import './ConfirmDialog.css';

const ConfirmDialog = ({ icon, title, description, confirmLabel, cancelLabel = 'إلغاء', onConfirm, onCancel }) => {
  return (
    <div className="confirm-backdrop" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">{icon}</div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-desc">{description}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-danger" onClick={onConfirm}>{confirmLabel}</button>
          <button className="confirm-btn-cancel" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
