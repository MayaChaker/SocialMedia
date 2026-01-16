import "./Topbar.css";
import { Search, Person, Chat, Notifications, Add } from "@mui/icons-material";

function Topbar() {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div className="logoMark">L</div>
        <span className="logoText">Laamasocial</span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink topbarLinkActive">Home</span>
          <span className="topbarLink">Explore</span>
          <span className="topbarLink">Messages</span>
        </div>
        <button className="topbarActionButton">
          <Add className="topbarActionIcon" />
          Create
        </button>
        <div className="topbarIcons">
          <div className="topbarIconsItem">
            <Person />
            <span className="topbarIconsBadge">1</span>
          </div>
          <div className="topbarIconsItem">
            <Chat />
            <span className="topbarIconsBadge">2</span>
          </div>
          <div className="topbarIconsItem">
            <Notifications />
            <span className="topbarIconsBadge">3</span>
          </div>
        </div>
        <div className="topbarUser">
          <div className="topbarUserAvatar">
            <img src="assets/person/img1.jpg" alt="Profile" className="topbarImg" />
            <span className="topbarUserStatus" />
          </div>
          <span className="topbarUsername">Safak</span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
