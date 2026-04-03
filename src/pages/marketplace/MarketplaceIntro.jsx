import CreateTask from "../../components/CreateTask/CreateTask";

function MarketplaceIntro({ tasksVisible, onToggleTasks }) {
  return (
    <section className="marketplaceIntro">
      <img
        className="marketplaceIntroImage"
        src="/assets/images/img6.jpg"
        alt="People collaborating to get tasks done"
      />
      <div className="marketplaceIntroContent">
        <h1 className="marketplaceIntroTitle">Welcome to Taskora</h1>
        <p className="marketplaceIntroText">
          Post what you need, set a budget, and connect with people who can
          help. You can search tasks, filter by type/status, save tasks for
          later, and chat to coordinate details.
        </p>
        <CreateTask tasksVisible={tasksVisible} onToggleTasks={onToggleTasks} />
      </div>
    </section>
  );
}

export default MarketplaceIntro;
