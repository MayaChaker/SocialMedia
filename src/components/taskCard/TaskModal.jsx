import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LocationOn, AccessTime, Public, Work } from "@mui/icons-material";
import { ACTION_KEY, TASK_STATUS, TASK_TYPE, UI_TEXT } from "./taskConstants";

function TaskMadal({
  isOpen,
  onClose,
  status,
  statusClass,
  type,
  safeTask,
  countrySuffix,
  poster,
  posterAvatarSrc,
  isSaved,
  isMyTask,
  pendingActions,
  onToggleSaved,
  onDeleteTask,
  onCompleteTask,
  onMakeOffer,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const isSaving = Boolean(pendingActions?.[ACTION_KEY.SAVE]);
  const isDeleting = Boolean(pendingActions?.[ACTION_KEY.DELETE]);
  const isCompleting = Boolean(pendingActions?.[ACTION_KEY.COMPLETE]);
  const isOffering = Boolean(pendingActions?.[ACTION_KEY.OFFER]);

  return createPortal(
    <div
      className="taskModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label={UI_TEXT.TASK_DETAILS_ARIA}
      onClick={onClose}
    >
      <div
        className="post postModal"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
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
              <span className="postBudget">{safeTask.budget}</span>
              <button
                type="button"
                className="postModalClose"
                onClick={onClose}
                aria-label={UI_TEXT.CLOSE}
              >
                ×
              </button>
            </div>
          </div>

          <h3 className="postTitle postModalTitle">{safeTask.title}</h3>

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

          <p className="postDescription postDescriptionFull">
            {safeTask.description || UI_TEXT.NO_DESCRIPTION}
          </p>

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
                className={`actionButton save ${isSaved ? "saved" : ""} ${
                  isSaving ? "isLoading" : ""
                }`}
                disabled={isSaving}
                aria-busy={isSaving}
                onClick={() => {
                  if (isSaving) return;
                  onToggleSaved && onToggleSaved();
                }}
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

              {isMyTask && (
                <button
                  type="button"
                  className={`actionButton delete ${isDeleting ? "isLoading" : ""}`}
                  disabled={isDeleting}
                  aria-busy={isDeleting}
                  onClick={() => {
                    if (isDeleting) return;
                    onDeleteTask && onDeleteTask();
                  }}
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="actionButtonSpinner"
                        aria-hidden="true"
                      />
                      {UI_TEXT.DELETING}
                    </>
                  ) : (
                    UI_TEXT.DELETE
                  )}
                </button>
              )}

              {isMyTask && status === TASK_STATUS.OPEN && (
                <button
                  type="button"
                  className={`actionButton complete ${
                    isCompleting ? "isLoading" : ""
                  }`}
                  disabled={isCompleting}
                  aria-busy={isCompleting}
                  onClick={() => {
                    if (isCompleting) return;
                    onCompleteTask && onCompleteTask();
                  }}
                >
                  {isCompleting ? (
                    <>
                      <span
                        className="actionButtonSpinner"
                        aria-hidden="true"
                      />
                      {UI_TEXT.COMPLETING}
                    </>
                  ) : (
                    UI_TEXT.MARK_COMPLETED
                  )}
                </button>
              )}

              {!isMyTask && status === TASK_STATUS.OPEN && (
                <button
                  type="button"
                  className={`actionButton accept ${isOffering ? "isLoading" : ""}`}
                  disabled={isOffering}
                  aria-busy={isOffering}
                  onClick={() => {
                    if (isOffering) return;
                    onMakeOffer && onMakeOffer();
                  }}
                >
                  {isOffering ? (
                    <>
                      <span
                        className="actionButtonSpinner"
                        aria-hidden="true"
                      />
                      {UI_TEXT.SENDING_OFFER}
                    </>
                  ) : (
                    UI_TEXT.MAKE_OFFER
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default TaskMadal;
