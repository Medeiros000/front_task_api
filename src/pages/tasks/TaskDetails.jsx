import { useParams, Outlet, useOutletContext } from "react-router-dom";
import { taskService } from "../../api/taskService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TaskDetail() {
	const [task, setTask] = useState(null);
	const taskId = useParams().id;
	const { refetch } = useOutletContext() || {};

	useEffect(() => {
		taskService.getById(taskId).then((task) => {
			setTask(task);
		});
	}, [taskId]);

	function handleDeleteTask() {
		console.log("delete task", task);
		if (!task) return;
		taskService.delete(task.id).then(() => {
		  setTask(null);
		});
		useNavigate()(`/tasks`);
	}

	if (!task) {
		return (
			<div>
				<p>Loading...</p>
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
					<Link to={"/tasks"} onClick={handleDeleteTask}>Delete</Link>
				</div>
				<Outlet context={{ task, refetch }} />
			</div>
		</div>
	);
}

export default TaskDetail;
