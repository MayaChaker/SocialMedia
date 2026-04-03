import { useNavigate } from "react-router-dom";
import MarketplaceIntro from "./MarketplaceIntro";
import "./marketplace.css";

function Marketplace() {
  const navigate = useNavigate();

  return (
    <div className="homeContainer marketplaceIntroPage">
      <MarketplaceIntro
        tasksVisible={false}
        onToggleTasks={() => navigate("/tasks")}
      />
    </div>
  );
}

export default Marketplace;
