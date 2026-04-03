import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import LoadingIndicator from "./components/loading/LoadingIndicator";
import { AppProvider } from "./context/AppContext";
import { defaultTasks } from "./data/tasks";

const STORAGE_KEYS = Object.freeze({
  currentUserName: "currentUserName",
  defaultCountry: "defaultCountry",
  defaultCity: "defaultCity",
  userBio: "userBio",
  theme: "theme",
  taskSearchTerm: "taskSearchTerm",
  taskFilter: "taskFilter",
  taskSort: "taskSort",
  savedTaskIds: "savedTaskIds",
  tasks: "tasks",
  inboxItems: "inboxItems",
  chatThreads: "chatThreads",
});

const storage = {
  getString: (key, fallback) => {
    try {
      const raw =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return typeof raw === "string" && raw.length ? raw : fallback;
    } catch {
      return fallback;
    }
  },
  getJSON: (key, fallback) => {
    try {
      const raw =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },
  setString: (key, value) => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, String(value ?? ""));
    } catch {}
  },
  setJSON: (key, value) => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lazyWithDelay = (factory, minDelayMs = 500) =>
  lazy(async () => {
    const start = Date.now();
    const module = await factory();
    if (process.env.NODE_ENV !== "development") return module;
    const elapsed = Date.now() - start;
    if (elapsed < minDelayMs) await wait(minDelayMs - elapsed);
    return module;
  });

const Marketplace = lazyWithDelay(
  () => import("./pages/marketplace/Marketplace"),
);
const MarketplaceTasks = lazyWithDelay(
  () => import("./pages/marketplace/MarketplaceTasks"),
);
const Inbox = lazyWithDelay(() => import("./pages/inbox/Inbox"));
const Settings = lazyWithDelay(() => import("./pages/settings/Settings"));
const Chat = lazyWithDelay(() => import("./pages/chat/Chat"));

function App() {
  const [currentUserName, setCurrentUserName] = useState(() => {
    return storage.getString(STORAGE_KEYS.currentUserName, "Safak");
  });
  const previousUserNameRef = useRef(currentUserName);
  const [defaultCountry, setDefaultCountry] = useState(() => {
    return storage.getString(STORAGE_KEYS.defaultCountry, "Lebanon");
  });
  const [defaultCity, setDefaultCity] = useState(() => {
    return storage.getString(STORAGE_KEYS.defaultCity, "Beirut");
  });
  const [userBio, setUserBio] = useState(() => {
    return storage.getString(STORAGE_KEYS.userBio, "");
  });
  const [theme, setTheme] = useState(() => {
    return storage.getString(STORAGE_KEYS.theme, "dark");
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    return storage.getString(STORAGE_KEYS.taskSearchTerm, "");
  });
  const [filter, setFilter] = useState(() => {
    return storage.getString(STORAGE_KEYS.taskFilter, "All");
  });
  const [sort, setSort] = useState(() => {
    return storage.getString(STORAGE_KEYS.taskSort, "Newest");
  });
  const [savedTaskIds, setSavedTaskIds] = useState(() => {
    const parsed = storage.getJSON(STORAGE_KEYS.savedTaskIds, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [tasks, setTasks] = useState(() => {
    const parsedTasks = storage.getJSON(STORAGE_KEYS.tasks, null);
    if (!parsedTasks) return defaultTasks;

    try {
      if (!Array.isArray(parsedTasks)) return defaultTasks;

      const normalized = parsedTasks
        .map((t, index) => {
          if (!t || typeof t !== "object") return null;
          const id = t.id ?? Date.now() + index;
          return {
            id,
            title: typeof t.title === "string" ? t.title : "Task",
            budget: typeof t.budget === "string" ? t.budget : "",
            location: typeof t.location === "string" ? t.location : "",
            country: typeof t.country === "string" ? t.country : "Lebanon",
            type: typeof t.type === "string" ? t.type : "",
            date: typeof t.date === "string" ? t.date : "",
            status: typeof t.status === "string" ? t.status : "Open",
            description: typeof t.description === "string" ? t.description : "",
            poster: typeof t.poster === "string" ? t.poster : "Unknown",
            offerBy: typeof t.offerBy === "string" ? t.offerBy : undefined,
          };
        })
        .filter(Boolean);

      if (normalized.length === 0) return defaultTasks;

      const existingIds = new Set(normalized.map((t) => t.id));
      return [
        ...normalized,
        ...defaultTasks.filter((t) => !existingIds.has(t.id)),
      ];
    } catch {
      return defaultTasks;
    }
  });

  const [inboxItems, setInboxItems] = useState(() => {
    const parsed = storage.getJSON(STORAGE_KEYS.inboxItems, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [chatThreads, setChatThreads] = useState(() => {
    const parsed = storage.getJSON(STORAGE_KEYS.chatThreads, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  useEffect(() => {
    const previous = previousUserNameRef.current;
    const next = typeof currentUserName === "string" ? currentUserName : "";
    if (previous && next && previous !== next) {
      setTasks((prevTasks) => {
        let changed = false;
        const nextTasks = prevTasks.map((t) => {
          if (t.poster !== previous && t.offerBy !== previous) return t;
          changed = true;
          const nextTask = { ...t };
          if (nextTask.poster === previous) nextTask.poster = next;
          if (nextTask.offerBy === previous) nextTask.offerBy = next;
          return nextTask;
        });
        return changed ? nextTasks : prevTasks;
      });
      setChatThreads((prevThreads) => {
        let changed = false;
        const nextThreads = prevThreads.map((thread) => {
          if (!Array.isArray(thread.participants)) return thread;
          if (!thread.participants.includes(previous)) return thread;
          changed = true;
          return {
            ...thread,
            participants: thread.participants.map((p) =>
              p === previous ? next : p,
            ),
          };
        });
        return changed ? nextThreads : prevThreads;
      });
    }
    previousUserNameRef.current = next || previous;
  }, [currentUserName]);

  const inboxUnreadCount = useMemo(
    () => inboxItems.filter((i) => !i.read).length,
    [inboxItems],
  );

  useEffect(() => {
    storage.setJSON(STORAGE_KEYS.tasks, tasks);
    storage.setJSON(STORAGE_KEYS.savedTaskIds, savedTaskIds);
    storage.setString(STORAGE_KEYS.taskSort, sort);
    storage.setString(STORAGE_KEYS.taskSearchTerm, searchTerm);
    storage.setString(STORAGE_KEYS.taskFilter, filter);
    storage.setJSON(STORAGE_KEYS.inboxItems, inboxItems);
    storage.setJSON(STORAGE_KEYS.chatThreads, chatThreads);
    storage.setString(STORAGE_KEYS.currentUserName, currentUserName);
    storage.setString(STORAGE_KEYS.defaultCountry, defaultCountry);
    storage.setString(STORAGE_KEYS.defaultCity, defaultCity);
    storage.setString(STORAGE_KEYS.userBio, userBio);
  }, [
    chatThreads,
    currentUserName,
    defaultCity,
    defaultCountry,
    filter,
    inboxItems,
    savedTaskIds,
    searchTerm,
    sort,
    tasks,
    userBio,
  ]);

  useEffect(() => {
    storage.setString(STORAGE_KEYS.theme, theme);
    document.body.classList.toggle("luxeDark", theme === "dark");
  }, [theme]);

  const addInboxItem = useCallback((partial) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      read: false,
      ...partial,
    };
    setInboxItems((prev) => [item, ...prev]);
  }, []);

  const startChatThread = useCallback((task, fromUserName) => {
    const safeFrom = String(fromUserName || "").trim() || "You";
    const poster = String(task?.poster || "").trim();
    const other = poster && poster !== safeFrom ? poster : "Taskora";
    const taskId = task?.id;
    const taskTitle = String(task?.title || "").trim() || "Task";
    const now = Date.now();
    let threadId = `${now}-${Math.random().toString(16).slice(2)}`;

    setChatThreads((prev) => {
      const existingIndex = prev.findIndex(
        (t) =>
          t.taskId === taskId &&
          Array.isArray(t.participants) &&
          t.participants.includes(safeFrom) &&
          t.participants.includes(other),
      );

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        threadId = existing.id;
        const updated = { ...existing, updatedAt: now };
        if (existingIndex === 0) return [updated, ...prev.slice(1)];
        return [
          updated,
          ...prev.slice(0, existingIndex),
          ...prev.slice(existingIndex + 1),
        ];
      }

      const nextThread = {
        id: threadId,
        createdAt: now,
        updatedAt: now,
        taskId,
        taskTitle,
        participants: [safeFrom, other],
        messages: [],
      };
      return [nextThread, ...prev];
    });

    return threadId;
  }, []);

  const sendChatMessage = (threadId, sender, text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const nextMessage = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          sender: sender || "You",
          text: trimmed,
          createdAt: Date.now(),
        };
        return {
          ...t,
          updatedAt: Date.now(),
          messages: Array.isArray(t.messages)
            ? [...t.messages, nextMessage]
            : [nextMessage],
        };
      }),
    );
  };

  const addTask = useCallback(
    (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      addInboxItem({
        type: "task_posted",
        title: "Task posted",
        body: `Your task "${newTask.title}" is live.`,
        read: true,
      });
    },
    [addInboxItem],
  );

  const updateTaskStatus = useCallback(
    (taskId, newStatus, meta) => {
      const taskFromMeta =
        meta?.task && typeof meta.task === "object" ? meta.task : null;
      const task = tasks.find((t) => t.id === taskId) || taskFromMeta;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const next = { ...t, status: newStatus };
          if (newStatus === "Assigned" && meta?.offerBy) {
            next.offerBy = meta.offerBy;
          }
          return next;
        }),
      );

      if (task && newStatus === "Assigned" && meta?.offerBy) {
        addInboxItem({
          type: "offer_sent",
          title: "Offer sent",
          body: `You sent an offer to "${task.title}" posted by ${task.poster}.`,
          threadId: meta?.threadId,
        });
      }

      if (task && newStatus === "Completed") {
        addInboxItem({
          type: "task_completed",
          title: "Task completed",
          body: `Marked "${task.title}" as completed.`,
          read: true,
        });
      }
    },
    [addInboxItem, tasks],
  );

  const deleteTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (window.confirm("Are you sure you want to delete this task?")) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (task) {
          addInboxItem({
            type: "task_deleted",
            title: "Task removed",
            body: `Deleted "${task.title}".`,
            read: true,
          });
        }
      }
    },
    [addInboxItem, tasks],
  );

  const toggleSavedTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      setSavedTaskIds((prev) => {
        const isSaved = prev.includes(taskId);
        const next = isSaved
          ? prev.filter((id) => id !== taskId)
          : [taskId, ...prev];
        if (task) {
          addInboxItem({
            type: isSaved ? "task_unsaved" : "task_saved",
            title: isSaved ? "Removed from saved" : "Saved task",
            body: `"${task.title}" ${isSaved ? "removed from" : "added to"} your saved tasks.`,
            read: true,
          });
        }
        return next;
      });
    },
    [addInboxItem, tasks],
  );

  const inboxActions = useMemo(
    () => ({
      markAllRead: () =>
        setInboxItems((prev) => prev.map((i) => ({ ...i, read: true }))),
      markRead: (id) =>
        setInboxItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, read: true } : i)),
        ),
      clearAll: () => setInboxItems([]),
    }),
    [],
  );

  const marketplaceTasksBaseProps = useMemo(
    () => ({
      tasks,
      searchTerm,
      filter,
      savedTaskIds,
      sort,
      currentUserName,
      showShare: false,
      onUpdateStatus: updateTaskStatus,
      onDeleteTask: deleteTask,
      onToggleSaved: toggleSavedTask,
      onStartChat: startChatThread,
    }),
    [
      currentUserName,
      deleteTask,
      filter,
      savedTaskIds,
      searchTerm,
      sort,
      startChatThread,
      tasks,
      toggleSavedTask,
      updateTaskStatus,
    ],
  );

  return (
    <AppProvider
      value={{
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        sort,
        setSort,
        savedCount: savedTaskIds.length,
        inboxUnreadCount,
        currentUserName,
        setCurrentUserName,
        defaultCountry,
        setDefaultCountry,
        defaultCity,
        setDefaultCity,
        userBio,
        setUserBio,
        theme,
        setTheme,
        onClearSavedTasks: () => setSavedTaskIds([]),
        onClearInbox: () => setInboxItems([]),
        addTask,
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route
              path="/tasks"
              element={
                <MarketplaceTasks
                  title="Task Marketplace"
                  subtitle="Premium help for everyday needs."
                  {...marketplaceTasksBaseProps}
                />
              }
            />
            <Route
              path="/saved"
              element={
                <MarketplaceTasks
                  title="Saved Tasks"
                  subtitle="Your curated list of opportunities."
                  forcedFilter="Saved"
                  {...marketplaceTasksBaseProps}
                />
              }
            />
            <Route
              path="/my-tasks"
              element={
                <MarketplaceTasks
                  title="My Tasks"
                  subtitle="Manage your postings and progress."
                  forcedFilter="My Tasks"
                  {...marketplaceTasksBaseProps}
                />
              }
            />
            <Route
              path="/inbox"
              element={
                <Inbox
                  items={inboxItems}
                  onMarkRead={inboxActions.markRead}
                  onMarkAllRead={inboxActions.markAllRead}
                  onClearAll={inboxActions.clearAll}
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/chat/:threadId"
              element={
                <Chat
                  threads={chatThreads}
                  currentUserName={currentUserName}
                  onSendMessage={sendChatMessage}
                />
              }
            />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
