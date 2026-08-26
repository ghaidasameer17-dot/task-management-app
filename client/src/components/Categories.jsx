import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, GripVertical, MoreVertical, Tag } from 'lucide-react';
import './Categories.css';
import { getCategories, deleteCategory } from '../api/categories';
import { getTasks } from '../api/tasks';
import NewCategoryModal from './NewCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import ConfirmDialog from './ConfirmDialog';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [error, setError] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const [catData, taskData] = await Promise.all([getCategories(), getTasks()]);
      setCategories(catData);
      const counts = {};
      taskData.forEach((t) => {
        if (t.category_id) counts[t.category_id] = (counts[t.category_id] || 0) + 1;
      });
      setTaskCounts(counts);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const init = async () => { await load(); };
    init();
  }, []);

  const systemCats = categories.filter((c) => c.is_system);
  const otherCats = categories.filter((c) => !c.is_system);

  const handleCreated = (cat) => {
    setCategories((prev) => [...prev, cat]);
    setShowNewModal(false);
  };

  const handleSaved = (updated) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCat(null);
  };

  const handleDeleted = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setEditingCat(null);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    try {
      setError('');
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  };

  const renderRow = (cat, withMenu) => (
    <div key={cat.id} className="cat-row">
      <GripVertical size={16} className="cat-grip" />
      <span className="cat-dot" style={{ background: cat.color }} />
      <span className="cat-name">{cat.name}</span>
      {withMenu ? (
        <span
          className="cat-menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpenFor(menuOpenFor === cat.id ? null : cat.id);
          }}
        >
          <MoreVertical size={16} />
          {menuOpenFor === cat.id && (
            <div className="cat-menu-popup" onClick={(e) => e.stopPropagation()}>
              <div
                className="cat-menu-item"
                onClick={() => { setEditingCat(cat); setMenuOpenFor(null); }}
              >
                تعديل
              </div>
              <div
                className="cat-menu-item cat-menu-delete"
                onClick={() => { setMenuOpenFor(null); setDeleteTarget(cat); }}
              >
                حذف الفئة
              </div>
            </div>
          )}
        </span>
      ) : (
        <span className="cat-badge">افتراضية</span>
      )}
    </div>
  );

  return (
    <div className="cat-container" onClick={() => setMenuOpenFor(null)}>
      <div className="cat-header">
        <ArrowRight size={22} className="cat-back" onClick={() => navigate('/settings')} />
        <h2>الفئات</h2>
        <span style={{ width: 22 }} />
      </div>

      {error && <p className="cat-error">{error}</p>}

      <div className="cat-section-title">فئات النظام</div>
      <div className="cat-list">
        {systemCats.map((cat) => renderRow(cat, false))}
      </div>

      {otherCats.length > 0 && (
        <>
          <div className="cat-section-title">أخرى</div>
          <div className="cat-list">
            {otherCats.map((cat) => renderRow(cat, true))}
          </div>
        </>
      )}

      <button className="cat-add-link" onClick={() => setShowNewModal(true)}>
        <Plus size={16} /> فئة جديدة
      </button>

      {showNewModal && (
        <NewCategoryModal
          onCancel={() => setShowNewModal(false)}
          onCreated={handleCreated}
        />
      )}

      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          taskCount={taskCounts[editingCat.id] || 0}
          onCancel={() => setEditingCat(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          icon={<Tag size={22} />}
          title={`حذف فئة «${deleteTarget.name}»؟`}
          description={
            (taskCounts[deleteTarget.id] || 0) > 0
              ? `ستبقى ${taskCounts[deleteTarget.id]} مهام بدون فئة. لا يمكن التراجع.`
              : 'لا يمكن التراجع عن هذا الإجراء.'
          }
          confirmLabel="حذف"
          onConfirm={confirmDeleteCategory}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Categories;
