import { useNavigate, useParams, Outlet, useOutletContext } from "react-router-dom";
import { taskService } from "../../api/taskService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TaskDetails() {
	const [task, setTask] = useState(null);
	const [msg, setMsg] = useState("");
	const taskId = useParams().id;
	const { refetch } = useOutletContext() || {};
  const navigate = useNavigate();

	useEffect(() => {
		taskService.getById(taskId).then((task) => {
			setTask(task);
		});
	}, [taskId]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

	function handleDeleteTask() {
		console.log("delete task", task);
		taskService.delete(task.id).then(() => {
		  setTask(null);
      if (refetch) refetch();
      navigate(`/tasks`);
		}).catch((error) => {
      setMsg("You can only delete your own tasks");
      console.error("Error deleting task:", error.status);
    });
	}

	if (!task) {
		navigate(`/tasks`);
		return (
			<div>
				<p>Task not found</p>
			</div>
		);
	}

	return (
		<div className="task-details-container">
			<h2>Task Details</h2>
			<div className="task-details-inner center-item">
				<div>
					<Link to={"info"}>Info</Link>
					<Link to={"update"}>Update</Link>
					<Link onClick={handleDeleteTask}>
						Delete
					</Link>
				</div>
				<Outlet context={{ task, refetch }} />
        {msg && <p className="error" style={{color: "#ff0000", fontSize: "larger"}}>{msg}</p>}
			</div>
		</div>
	);
}

export default TaskDetails;
