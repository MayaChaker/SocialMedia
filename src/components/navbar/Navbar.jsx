import "./Navbar.css";
import { Search } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import UserDropdown from "./UserDropdown";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm, filter, setFilter, sort, setSort } =
    useAppContext();
  const isShowTasksRoute = location.pathname === "/tasks";
  const effectiveFilter =
    location.pathname === "/saved"
      ? "Saved"
      : location.pathname === "/my-tasks"
        ? "My Tasks"
        : filter;

  const filters = [
    "All",
    "Saved",
    "Physical",
    "Online",
    "Open",
    "Completed",
    "My Tasks",
  ];

  const handleHomeClick = () => {
    if (setSearchTerm) setSearchTerm("");
    if (setFilter) setFilter("All");
    if (location.pathname !== "/") navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterClick = (nextFilter) => {
    if (setFilter) setFilter(nextFilter);
    const targetPath =
      nextFilter === "Saved"
        ? "/saved"
        : nextFilter === "My Tasks"
          ? "/my-tasks"
          : "/tasks";
    if (location.pathname !== targetPath) navigate(targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div className="logoMark">T</div>
        <span className="logoText" onClick={handleHomeClick}>
          Taskora
        </span>
      </div>
      <div className="topbarCenter">
        {isShowTasksRoute ? (
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for tasks, location or keywords"
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            />
            <select
              className="topbarFilterSelect"
              value={effectiveFilter}
              onChange={(e) => handleFilterClick(e.target.value)}
              aria-label="Filter tasks"
            >
              {filters.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select
              className="topbarSort"
              value={sort}
              onChange={(e) => setSort && setSort(e.target.value)}
              aria-label="Sort tasks"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Budget: High">Budget: High</option>
              <option value="Budget: Low">Budget: Low</option>
            </select>
          </div>
        ) : null}
      </div>
      <div className="topbarRight">
        <UserDropdown />
      </div>
    </div>
  );
}

export default Navbar;
