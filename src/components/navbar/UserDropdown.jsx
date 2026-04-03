import { useEffect, useRef, useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { getAvatarDataUrl } from "../../utils/avatarDataUrl";

function UserDropdown() {
  const navigate = useNavigate();
  const { currentUserName, savedCount, inboxUnreadCount } = useAppContext();
  const avatarSrc = getAvatarDataUrl(currentUserName || "You");

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(event.target)) return;
      setIsUserMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="topbarUserMenu" ref={userMenuRef}>
      <button
        type="button"
        className={`topbarUserButton ${isUserMenuOpen ? "open" : ""}`}
        onClick={() => setIsUserMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isUserMenuOpen}
      >
        <div className="topbarUserAvatar">
          <img src={avatarSrc} alt="Profile" className="topbarImg" />
        </div>
        <span className="topbarUsername">{currentUserName}</span>
        <KeyboardArrowDown className="topbarUserCaret" />
      </button>
      {isUserMenuOpen && (
        <div className="topbarUserDropdown" role="menu">
          <button
            type="button"
            className="topbarUserDropdownItem"
            role="menuitem"
            onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/");
            }}
          >
            Home
          </button>
          <button
            type="button"
            className="topbarUserDropdownItem"
            role="menuitem"
            onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/saved");
            }}
          >
            <span className="topbarUserDropdownText">Saved</span>
            {savedCount ? (
              <span className="topbarUserDropdownBadge">{savedCount}</span>
            ) : null}
          </button>
          <button
            type="button"
            className="topbarUserDropdownItem"
            role="menuitem"
            onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/my-tasks");
            }}
          >
            My Tasks
          </button>
          <button
            type="button"
            className="topbarUserDropdownItem"
            role="menuitem"
            onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/inbox");
            }}
          >
            <span className="topbarUserDropdownText">Inbox</span>
            {inboxUnreadCount ? (
              <span className="topbarUserDropdownBadge">{inboxUnreadCount}</span>
            ) : null}
          </button>
          <button
            type="button"
            className="topbarUserDropdownItem"
            role="menuitem"
            onClick={() => {
              setIsUserMenuOpen(false);
              navigate("/settings");
            }}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
