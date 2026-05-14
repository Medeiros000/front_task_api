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
	const [spinner, setSpinner] = useState(true);

	function Spinner() {
		return (
			<svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
				<circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
			</svg>
		);
	}

	useEffect(() => {
		taskService.getById(taskId).then((task) => {
			setTask(task);
			setSpinner(false);
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
		taskService
			.delete(taskId)
			.then(() => {
				setTask(null);
				if (refetch) refetch();
				navigate(`/tasks`);
			})
			.catch((error) => {
				if (error.status === 403) {
					setMsg("You can only delete your own tasks");
				}
				setMsg("You can only delete your own tasks");
			});
	}

	// if (!task) {
	// 	return <Spinner />;
	// }

	return (
  <>
    {spinner && <Spinner />}
		<div className="task-details-container">
			<h2>Task Details</h2>
			<div className="task-details-inner center-item">
				<div>
					<Link to={"info"}>Info</Link>
					<Link to={"update"}>Update</Link>
					<Link onClick={handleDeleteTask}>Delete</Link>
				</div>
				<Outlet context={{ task, refetch }} />
				{msg && <p className="error">{msg}</p>}
			</div>
		</div>
  </>
	);
}

export default TaskDetails;
