import "./inbox.css";
import { useNavigate } from "react-router-dom";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

function Inbox({
  items = [],
  onMarkRead = () => {},
  onMarkAllRead = () => {},
  onClearAll = () => {},
}) {
  const navigate = useNavigate();
  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="inboxPage">
      <div className="inboxWrapper">
        <div className="inboxHeader">
          <div className="inboxHeaderLeft">
            <h1 className="inboxTitle">Inbox</h1>
            <div className="inboxSubtitle">
              {unreadCount ? `${unreadCount} unread` : "All caught up"}
            </div>
          </div>
          <div className="inboxHeaderRight">
            <button
              type="button"
              className="inboxActionButton"
              onClick={onMarkAllRead}
              disabled={!unreadCount}
            >
              Mark all read
            </button>
            <button
              type="button"
              className="inboxActionButton danger"
              onClick={onClearAll}
              disabled={!items.length}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="inboxList">
          {items.length ? (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`inboxItem ${item.read ? "" : "unread"}`}
                onClick={() => {
                  onMarkRead(item.id);
                  if (item.threadId) navigate(`/chat/${item.threadId}`);
                }}
              >
                <div className="inboxItemTop">
                  <div className="inboxItemTitle">{item.title}</div>
                  <div className="inboxItemTime">
                    {item.createdAt ? formatTime(item.createdAt) : ""}
                  </div>
                </div>
                <div className="inboxItemBody">{item.body}</div>
              </button>
            ))
          ) : (
            <div className="inboxEmpty">
              No messages yet. Activity like offers, saves, and updates will
              appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;
