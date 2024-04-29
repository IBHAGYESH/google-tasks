import { useOutletContext } from "react-router-dom";
import Kanban from "./components/Kanban";
import List from "./components/List";

const Dashboard = () => {
  const [view] = useOutletContext();
  return view === "Kanban" ? <Kanban /> : <List />;
};

export default Dashboard;
