import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskCard.css";
import { getAvatarDataUrl } from "../../utils/avatarDataUrl";
import TaskMadal from "./TaskModal";
import {
  ACTION_KEY,
  DEFAULT_COUNTRY,
  TASK_STATUS,
  TASK_TYPE,
  UI_TEXT,
} from "./taskConstants";
import {
  LocationOn,
  AccessTime,
  CheckCircle,
  Delete,
  Public,
  Work,
} from "@mui/icons-material";

function TaskItem({
  task,
  isSaved,
  currentUserName = "You",
  onUpdateStatus = () => {},
  onDeleteTask = () => {},
  onToggleSaved = () => {},
  onStartChat = () => {},
}) {
  const safeTask = task && typeof task === "object" ? task : {};
  const taskId = safeTask.id;
  const status =
    typeof safeTask.status === "string" && safeTask.status
      ? safeTask.status
      : TASK_STATUS.OPEN;
  const statusClass = status.toLowerCase().replace(" ", "-");
  const type = typeof safeTask.type === "string" ? safeTask.type : "";
  const poster =
    typeof safeTask.poster === "string" && safeTask.poster.trim()
      ? safeTask.poster
      : UI_TEXT.UNKNOWN_POSTER;
  const posterAvatarSrc = getAvatarDataUrl(poster);
  const resolvedCurrentUserName = currentUserName || UI_TEXT.YOU;
  const isMyTask = poster === resolvedCurrentUserName;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pendingActions, setPendingActions] = useState(() => ({
    [ACTION_KEY.SAVE]: false,
    [ACTION_KEY.DELETE]: false,
    [ACTION_KEY.COMPLETE]: false,
    [ACTION_KEY.OFFER]: false,
  }));
  const navigate = useNavigate();

  const countrySuffix =
    safeTask.country && safeTask.country !== DEFAULT_COUNTRY
      ? `, ${safeTask.country}`
      : safeTask.country === DEFAULT_COUNTRY && type === TASK_TYPE.ONLINE
        ? `, ${safeTask.country}`
        : "";

  const runAction = async (actionKey, fn) => {
    if (!actionKey || pendingActions[actionKey]) return;
    setPendingActions((prev) => ({ ...prev, [actionKey]: true }));
    try {
      return await Promise.resolve(fn());
    } finally {
      setPendingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleToggleSaved = () =>
    runAction(ACTION_KEY.SAVE, () => {
      if (taskId == null) return;
      onToggleSaved && onToggleSaved(taskId);
    });

  const handleDelete = ({ closeModal } = {}) =>
    runAction(ACTION_KEY.DELETE, () => {
      if (taskId == null) return;
      onDeleteTask(taskId);
      if (closeModal) setIsDetailsOpen(false);
    });

  const handleComplete = () =>
    runAction(ACTION_KEY.COMPLETE, () => {
      if (taskId == null) return;
      onUpdateStatus(taskId, TASK_STATUS.COMPLETED);
    });

  const handleOffer = ({ closeModal } = {}) =>
    runAction(ACTION_KEY.OFFER, () => {
      if (taskId == null) return;
      const threadId = onStartChat(safeTask, resolvedCurrentUserName);
      onUpdateStatus(taskId, TASK_STATUS.ASSIGNED, {
        offerBy: resolvedCurrentUserName,
        threadId,
        task: safeTask,
      });
      if (closeModal) setIsDetailsOpen(false);
      if (threadId) navigate(`/chat/${threadId}`);
    });

  const isSaving = pendingActions[ACTION_KEY.SAVE];
  const isDeleting = pendingActions[ACTION_KEY.DELETE];
  const isCompleting = pendingActions[ACTION_KEY.COMPLETE];
  const isOffering = pendingActions[ACTION_KEY.OFFER];

  return (
    <div className={`post ${isDetailsOpen ? "isModalOpen" : ""}`}>
      <div className="postWrapper">
        <div className="postHeader">
          <div className="postStatusGroup">
            <span className={`postStatus ${statusClass}`}>{status}</span>
            {type && (
              <span className={`postType ${type.toLowerCase()}`}>
                {type === TASK_TYPE.ONLINE ? (
                  <Public sx={{ fontSize: 14 }} />
                ) : (
                  <Work sx={{ fontSize: 14 }} />
                )}
                {type}
              </span>
            )}
          </div>
          <div className="postHeaderRight">
            <button
              type="button"
              className={`actionButton save ${isSaved ? "saved" : ""} ${
                isSaving ? "isLoading" : ""
              }`}
              disabled={isSaving}
              aria-busy={isSaving}
              onClick={handleToggleSaved}
              title={isSaved ? UI_TEXT.UNSAVE : UI_TEXT.SAVE}
            >
              {isSaving ? (
                <>
                  <span className="actionButtonSpinner" aria-hidden="true" />
                  {UI_TEXT.SAVING}
                </>
              ) : isSaved ? (
                UI_TEXT.SAVED
              ) : (
                UI_TEXT.SAVE
              )}
            </button>
            <span className="postBudget">{safeTask.budget}</span>
          </div>
        </div>

        <button
          type="button"
          className="postTitleButton"
          onClick={() => setIsDetailsOpen(true)}
        >
          <h3 className="postTitle">{safeTask.title}</h3>
        </button>

        <div className="postDetails">
          <div className="postDetailItem">
            <LocationOn className="postIcon" />
            <span className="postDetailText">
              {safeTask.location}
              {countrySuffix}
            </span>
          </div>
          <div className="postDetailItem">
            <AccessTime className="postIcon" />
            <span className="postDetailText">{safeTask.date}</span>
          </div>
        </div>

        <p className="postDescription">{safeTask.description}</p>

        <div className="postFooter">
          <div className="postPoster">
            <img
              className="posterAvatar"
              src={posterAvatarSrc}
              alt={`${poster} avatar`}
            />
            <span className="posterName">{poster}</span>
          </div>

          <div className="postActions">
            <button
              type="button"
              className="actionButton view"
              onClick={() => setIsDetailsOpen(true)}
              title={UI_TEXT.VIEW_DETAILS}
            >
              {UI_TEXT.VIEW}
            </button>

            {isMyTask && (
              <button
                className={`actionButton delete ${isDeleting ? "isLoading" : ""}`}
                disabled={isDeleting}
                aria-busy={isDeleting}
                onClick={() => handleDelete()}
                title={UI_TEXT.DELETE}
              >
                {isDeleting ? (
                  <span className="actionButtonSpinner" aria-hidden="true" />
                ) : (
                  <Delete sx={{ fontSize: 20 }} />
                )}
              </button>
            )}

            {isMyTask && status === TASK_STATUS.OPEN && (
              <button
                className={`actionButton complete ${
                  isCompleting ? "isLoading" : ""
                }`}
                disabled={isCompleting}
                aria-busy={isCompleting}
                onClick={handleComplete}
                title={UI_TEXT.MARK_COMPLETED}
              >
                {isCompleting ? (
                  <span className="actionButtonSpinner" aria-hidden="true" />
                ) : (
                  <CheckCircle sx={{ fontSize: 20 }} />
                )}
              </button>
            )}

            {!isMyTask && status === TASK_STATUS.OPEN && (
              <button
                className={`actionButton accept ${isOffering ? "isLoading" : ""}`}
                disabled={isOffering}
                aria-busy={isOffering}
                onClick={() => handleOffer()}
                title={UI_TEXT.MAKE_OFFER}
              >
                {isOffering ? (
                  <>
                    <span className="actionButtonSpinner" aria-hidden="true" />
                    {UI_TEXT.SENDING_OFFER}
                  </>
                ) : (
                  UI_TEXT.MAKE_OFFER
                )}
              </button>
            )}

            {status === TASK_STATUS.ASSIGNED && !isMyTask && (
              <span className="assignedBadge">{UI_TEXT.OFFER_SENT}</span>
            )}

            {status === TASK_STATUS.ASSIGNED && isMyTask && (
              <span className="assignedBadge">
                {UI_TEXT.OFFER_RECEIVED}
                {safeTask.offerBy ? `: ${safeTask.offerBy}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      <TaskMadal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        status={status}
        statusClass={statusClass}
        type={type}
        safeTask={safeTask}
        countrySuffix={countrySuffix}
        poster={poster}
        posterAvatarSrc={posterAvatarSrc}
        isSaved={isSaved}
        isMyTask={isMyTask}
        pendingActions={pendingActions}
        onToggleSaved={() => handleToggleSaved()}
        onDeleteTask={() => handleDelete({ closeModal: true })}
        onCompleteTask={() => handleComplete()}
        onMakeOffer={() => handleOffer({ closeModal: true })}
      />
    </div>
  );
}

export default TaskItem;
