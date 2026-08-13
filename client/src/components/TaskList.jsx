import './TaskList.css';

const TaskList = () => {
  return (
    <div className="task-container">
      <div className="task-row">
        <span className="task-check"></span>
        <span className="task-priority priority-high">▲</span>
        <span className="task-title">اذاكر للاختبار</span>
        <span className="task-cat">دراسة</span>
        <span className="task-date">١٩/٧ · ٩:٠٠ ص</span>
      </div>
    </div>
  );
};

export default TaskList;