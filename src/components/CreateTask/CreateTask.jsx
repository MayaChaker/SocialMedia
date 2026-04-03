import { useState } from "react";
import "./CreateTask.css";
import { AttachMoney, LocationOn, Public, Work } from "@mui/icons-material";
import { useAppContext } from "../../context/AppContext";

function CreateTask({
  onAddTask,
  posterName,
  defaultCountry,
  tasksVisible,
  onToggleTasks,
}) {
  const {
    addTask,
    currentUserName,
    defaultCountry: contextDefaultCountry,
  } = useAppContext();
  const resolvedOnAddTask = onAddTask || addTask || (() => {});
  const resolvedPosterName = posterName || currentUserName || "You";
  const resolvedDefaultCountry =
    defaultCountry || contextDefaultCountry || "Lebanon";

  const [isExpanded] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState(resolvedDefaultCountry);
  const [taskType, setTaskType] = useState("Physical");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !budget) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      budget: `$${budget}`,
      location: taskType === "Online" ? "Remote" : location || "Beirut",
      country: country || "Lebanon",
      type: taskType,
      date: "Just now",
      status: "Open",
      poster: resolvedPosterName,
    };

    resolvedOnAddTask(newTask);
    setTitle("");
    setDescription("");
    setBudget("");
    setLocation("");
    setCountry(resolvedDefaultCountry);
    setTaskType("Physical");
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <input
            placeholder="What do you need done?"
            className="shareInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {isExpanded && (
          <div className="shareForm">
            <textarea
              placeholder="Describe your task in more detail..."
              className="shareTextarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="shareTypeSelector">
              <button
                type="button"
                className={`typeButton ${taskType === "Physical" ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setTaskType("Physical");
                }}
              >
                <Work className="typeIcon" /> Physical Task
              </button>
              <button
                type="button"
                className={`typeButton ${taskType === "Online" ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setTaskType("Online");
                }}
              >
                <Public className="typeIcon" /> Online Task
              </button>
            </div>

            <div className="shareInputsRow">
              <div className="shareInputGroup">
                <AttachMoney className="shareInputIcon" />
                <input
                  placeholder="Budget"
                  className="shareSmallInput"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  type="number"
                />
              </div>

              {taskType === "Physical" && (
                <div className="shareInputGroup">
                  <LocationOn className="shareInputIcon" />
                  <input
                    placeholder="Location (e.g. Beirut)"
                    className="shareSmallInput"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              )}

              <div className="shareInputGroup">
                <Public className="shareInputIcon" />
                <input
                  placeholder="Country"
                  className="shareSmallInput"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <hr className="shareHr" />

        <div className="shareBottom">
          <div className="shareOptions">
            <span className="shareOptionText">
              Post a task and get offers from skilled people.
            </span>
          </div>
          <div className="shareActions">
            <button
              type="button"
              className="shareButton"
              onClick={handleSubmit}
            >
              Post Task
            </button>
            {typeof onToggleTasks === "function" && (
              <button
                type="button"
                className="shareButton shareButtonSecondary"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleTasks();
                }}
              >
                {tasksVisible ? "Hide Tasks" : "Show Tasks"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
