import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import AddTask from "./create/add-task";

const AddTaskPage = () => {
  const { tasklistId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const title = decodeURIComponent(searchParams.get("title") || "");

  return (
    <AddTask
      onClose={() => navigate("/")}
      tasklistId={tasklistId}
      title={title}
    />
  );
};

export default AddTaskPage;
