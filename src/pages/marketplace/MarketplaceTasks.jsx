import TaskFeed from "../../components/taskFeed/TaskFeed";
import "./marketplace.css";

function MarketplaceTasks({
  title,
  subtitle,
  tasks,
  searchTerm,
  filter,
  savedTaskIds,
  sort,
  currentUserName,
  forcedFilter,
  showShare = false,
  onUpdateStatus,
  onDeleteTask,
  onToggleSaved,
  onStartChat,
}) {
  return (
    <div className="homeContainer">
      <TaskFeed
        title={title}
        subtitle={subtitle}
        tasks={tasks}
        searchTerm={searchTerm}
        filter={filter}
        savedTaskIds={savedTaskIds}
        sort={sort}
        currentUserName={currentUserName}
        showShare={showShare}
        forcedFilter={forcedFilter}
        onUpdateStatus={onUpdateStatus}
        onDeleteTask={onDeleteTask}
        onToggleSaved={onToggleSaved}
        onStartChat={onStartChat}
      />
    </div>
  );
}

export default MarketplaceTasks;
