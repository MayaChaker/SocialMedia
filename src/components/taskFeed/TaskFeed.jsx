import "./TaskFeed.css";
import CreateTask from "../CreateTask/CreateTask";
import TaskItem from "../taskCard/TaskItem";

function TaskFeed({
  title,
  subtitle,
  tasks = [],
  searchTerm = "",
  filter = "All",
  savedTaskIds = [],
  sort = "Newest",
  currentUserName = "You",
  showShare = true,
  forcedFilter,
  onUpdateStatus = () => {},
  onDeleteTask = () => {},
  onToggleSaved = () => {},
  onStartChat = () => {},
}) {
  const effectiveFilter = forcedFilter || filter;
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description.toLowerCase().includes(lowerSearch) ||
          task.location.toLowerCase().includes(lowerSearch) ||
          (task.country && task.country.toLowerCase().includes(lowerSearch));

        if (!matchesSearch) return false;
      }

      if (effectiveFilter === "All") return true;
      if (effectiveFilter === "Saved") return savedTaskIds.includes(task.id);
      if (effectiveFilter === "Open") return task.status === "Open";
      if (effectiveFilter === "Completed") return task.status === "Completed";
      if (effectiveFilter === "My Tasks")
        return task.poster === (currentUserName || "You");
      if (effectiveFilter === "Physical") return task.type === "Physical";
      if (effectiveFilter === "Online") return task.type === "Online";
      return true;
    })
    .slice()
    .sort((a, b) => {
      const parseBudget = (budget) => {
        if (!budget) return 0;
        const num = Number(String(budget).replace(/[^0-9.]/g, ""));
        return Number.isFinite(num) ? num : 0;
      };

      if (sort === "Oldest") return a.id - b.id;
      if (sort === "Budget: High")
        return parseBudget(b.budget) - parseBudget(a.budget);
      if (sort === "Budget: Low")
        return parseBudget(a.budget) - parseBudget(b.budget);
      return b.id - a.id;
    });

  return (
    <div className="feed">
      <div className="feedWrapper">
        {title ? (
          <div className="feedHeader">
            <div className="feedTitle">{title}</div>
            {subtitle ? <div className="feedSubtitle">{subtitle}</div> : null}
          </div>
        ) : null}

        {showShare && <CreateTask />}

        <div className="taskList">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSaved={savedTaskIds.includes(task.id)}
                currentUserName={currentUserName}
                onUpdateStatus={onUpdateStatus}
                onDeleteTask={onDeleteTask}
                onToggleSaved={onToggleSaved}
                onStartChat={onStartChat}
              />
            ))
          ) : (
            <div className="noTasksMessage">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskFeed;
