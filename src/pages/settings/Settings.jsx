import "./settings.css";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";

function Settings(props) {
  const contextValue = useAppContext();

  const propsValue = props || {};
  const mergedValue = {
    ...contextValue,
    ...Object.fromEntries(
      Object.entries(propsValue).filter(([, value]) => value !== undefined),
    ),
  };

  const safeName =
    typeof mergedValue.currentUserName === "string"
      ? mergedValue.currentUserName
      : "";
  const safeCountry =
    typeof mergedValue.defaultCountry === "string"
      ? mergedValue.defaultCountry
      : "";
  const safeCity =
    typeof mergedValue.defaultCity === "string" ? mergedValue.defaultCity : "";
  const safeBio =
    typeof mergedValue.userBio === "string" ? mergedValue.userBio : "";
  const resolvedTheme =
    typeof mergedValue.theme === "string" ? mergedValue.theme : "dark";

  const resolvedSetCurrentUserName =
    typeof mergedValue.setCurrentUserName === "function"
      ? mergedValue.setCurrentUserName
      : () => {};
  const resolvedSetDefaultCountry =
    typeof mergedValue.setDefaultCountry === "function"
      ? mergedValue.setDefaultCountry
      : () => {};
  const resolvedSetDefaultCity =
    typeof mergedValue.setDefaultCity === "function"
      ? mergedValue.setDefaultCity
      : () => {};
  const resolvedSetUserBio =
    typeof mergedValue.setUserBio === "function"
      ? mergedValue.setUserBio
      : () => {};
  const resolvedSetTheme =
    typeof mergedValue.setTheme === "function"
      ? mergedValue.setTheme
      : () => {};
  const resolvedClearSaved =
    typeof mergedValue.onClearSavedTasks === "function"
      ? mergedValue.onClearSavedTasks
      : () => {};
  const resolvedClearInbox =
    typeof mergedValue.onClearInbox === "function"
      ? mergedValue.onClearInbox
      : () => {};

  const [draftName, setDraftName] = useState(safeName);
  const [draftCountry, setDraftCountry] = useState(safeCountry);
  const [draftCity, setDraftCity] = useState(safeCity);
  const [draftBio, setDraftBio] = useState(safeBio);

  useEffect(() => {
    setDraftName(safeName);
    setDraftCountry(safeCountry);
    setDraftCity(safeCity);
    setDraftBio(safeBio);
  }, [safeBio, safeCity, safeCountry, safeName]);

  const normalizedSafe = useMemo(
    () => ({
      name: (safeName || "").trim() || "You",
      country: (safeCountry || "").trim() || "Lebanon",
      city: (safeCity || "").trim() || "Beirut",
      bio: (safeBio || "").slice(0, 160),
    }),
    [safeBio, safeCity, safeCountry, safeName],
  );

  const normalizedDraft = useMemo(
    () => ({
      name: (draftName || "").trim() || "You",
      country: (draftCountry || "").trim() || "Lebanon",
      city: (draftCity || "").trim() || "Beirut",
      bio: (draftBio || "").slice(0, 160),
    }),
    [draftBio, draftCity, draftCountry, draftName],
  );

  const profileDirty =
    normalizedDraft.name !== normalizedSafe.name ||
    normalizedDraft.country !== normalizedSafe.country ||
    normalizedDraft.city !== normalizedSafe.city ||
    normalizedDraft.bio !== normalizedSafe.bio;

  const saveProfile = () => {
    if (!profileDirty) return;

    setDraftName(normalizedDraft.name);
    setDraftCountry(normalizedDraft.country);
    setDraftCity(normalizedDraft.city);
    setDraftBio(normalizedDraft.bio);

    resolvedSetCurrentUserName(normalizedDraft.name);
    resolvedSetDefaultCountry(normalizedDraft.country);
    resolvedSetDefaultCity(normalizedDraft.city);
    resolvedSetUserBio(normalizedDraft.bio);
  };
  return (
    <div className="settingsPage">
      <div className="settingsWrapper">
        <div className="settingsHeader">
          <h1 className="settingsTitle">Settings</h1>
          <div className="settingsSubtitle">
            Personalize your Taskora experience.
          </div>
        </div>

        <div className="settingsCard">
          <div className="settingsSectionTitle">Profile</div>
          <div className="settingsGrid">
            <label className="settingsField">
              <div className="settingsLabel">Display name</div>
              <input
                className="settingsInput"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => {
                  setDraftName((v) => (typeof v === "string" ? v.trim() : ""));
                }}
                placeholder="Your name"
              />
            </label>
            <label className="settingsField">
              <div className="settingsLabel">Default country</div>
              <input
                className="settingsInput"
                type="text"
                value={draftCountry}
                onChange={(e) => setDraftCountry(e.target.value)}
                onBlur={() => {
                  setDraftCountry((v) =>
                    typeof v === "string" ? v.trim() : "",
                  );
                }}
                placeholder="Lebanon"
              />
            </label>
            <label className="settingsField">
              <div className="settingsLabel">Default city</div>
              <input
                className="settingsInput"
                type="text"
                value={draftCity}
                onChange={(e) => setDraftCity(e.target.value)}
                onBlur={() => {
                  setDraftCity((v) => (typeof v === "string" ? v.trim() : ""));
                }}
                placeholder="Beirut"
              />
            </label>
            <label className="settingsField">
              <div className="settingsLabel">Bio</div>
              <textarea
                className="settingsTextarea"
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value.slice(0, 160))}
                placeholder="Write a short bio..."
              />
              <div className="settingsHint">{draftBio.length}/160</div>
            </label>
          </div>
          <div className="settingsActions">
            <button
              type="button"
              className="settingsButton settingsButtonPrimary"
              disabled={!profileDirty}
              onClick={saveProfile}
            >
              Save profile
            </button>
          </div>
        </div>

        <div className="settingsCard">
          <div className="settingsSectionTitle">Appearance</div>
          <div className="settingsRow">
            <div className="settingsRowLeft">
              <div className="settingsLabel">Theme</div>
              <div className="settingsHint">
                Dark mode is recommended for the luxury look.
              </div>
            </div>
            <div className="settingsRowRight">
              <button
                type="button"
                className={`settingsPill ${resolvedTheme === "dark" ? "active" : ""}`}
                onClick={() => resolvedSetTheme("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                className={`settingsPill ${resolvedTheme === "light" ? "active" : ""}`}
                onClick={() => resolvedSetTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        <div className="settingsCard">
          <div className="settingsSectionTitle">Data</div>
          <div className="settingsRow">
            <div className="settingsRowLeft">
              <div className="settingsLabel">Quick actions</div>
              <div className="settingsHint">
                Manage saved tasks and inbox notifications on this device.
              </div>
            </div>
            <div className="settingsRowRight">
              <button
                type="button"
                className="settingsPill"
                onClick={() => {
                  if (window.confirm("Clear all saved tasks?"))
                    resolvedClearSaved();
                }}
              >
                Clear saved
              </button>
              <button
                type="button"
                className="settingsPill settingsPillDanger"
                onClick={() => {
                  if (window.confirm("Clear inbox items?"))
                    resolvedClearInbox();
                }}
              >
                Clear inbox
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
