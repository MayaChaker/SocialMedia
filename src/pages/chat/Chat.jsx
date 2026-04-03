import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./chat.css";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

function Chat({ threads = [], currentUserName = "You", onSendMessage = () => {} }) {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");

  const thread = useMemo(
    () => threads.find((t) => String(t.id) === String(threadId)),
    [threads, threadId],
  );

  const otherUser = useMemo(() => {
    if (!thread?.participants) return "";
    return thread.participants.find((p) => p !== (currentUserName || "You")) || "";
  }, [thread, currentUserName]);

  if (!thread) {
    return (
      <div className="chatPage">
        <div className="chatWrapper">
          <div className="chatEmptyCard">
            <div className="chatEmptyTitle">Chat not found</div>
            <div className="chatEmptyBody">
              This chat may have been cleared on this device.
            </div>
            <div className="chatEmptyActions">
              <button
                type="button"
                className="chatButton"
                onClick={() => navigate("/")}
              >
                Back to tasks
              </button>
              <button
                type="button"
                className="chatButton secondary"
                onClick={() => navigate("/inbox")}
              >
                Open inbox
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const messages = Array.isArray(thread.messages) ? thread.messages : [];

  const handleSend = () => {
    const trimmed = String(draft || "").trim();
    if (!trimmed) return;
    onSendMessage(thread.id, currentUserName || "You", trimmed);
    setDraft("");
  };

  return (
    <div className="chatPage">
      <div className="chatWrapper">
        <div className="chatHeader">
          <button type="button" className="chatBack" onClick={() => navigate(-1)}>
            Back
          </button>
          <div className="chatHeaderMain">
            <div className="chatTitle">{thread.taskTitle || "Chat"}</div>
            <div className="chatSubtitle">
              {otherUser ? `Chatting with ${otherUser}` : "Chat"}
            </div>
          </div>
          <button type="button" className="chatButton secondary" onClick={() => navigate("/inbox")}>
            Inbox
          </button>
        </div>

        <div className="chatCard">
          <div className="chatMessages">
            {messages.length ? (
              messages.map((m) => {
                const mine = m.sender === (currentUserName || "You");
                return (
                  <div
                    key={m.id}
                    className={`chatMessageRow ${mine ? "mine" : "theirs"}`}
                  >
                    <div className="chatBubble">
                      <div className="chatBubbleText">{m.text}</div>
                      <div className="chatBubbleMeta">
                        <span className="chatBubbleSender">
                          {mine ? "You" : m.sender}
                        </span>
                        <span className="chatBubbleDot">•</span>
                        <span className="chatBubbleTime">
                          {m.createdAt ? formatTime(m.createdAt) : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="chatEmpty">
                No messages yet. Send a message to start the conversation.
              </div>
            )}
          </div>

          <div className="chatComposer">
            <input
              className="chatInput"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button type="button" className="chatButton" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
