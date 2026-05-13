import { Outlet, Link, useLocation } from "react-router-dom";
import { taskService } from "../../api/taskService";
import TaskNavBar from "../../components/TaskNavBar";
import { use, useEffect, useState } from "react";

function Tasks(props) {
	const [tasks, setTasks] = useState([]);
	const location = useLocation();

	const fetchTasks = async () => {
    if(!props.token) {
      console.warn("No token provided. Cannot fetch tasks.");
      return;
    }
		try {
			const data = await taskService.getAll();
			setTasks(data);
		} catch (error) {
			console.error("Error fetching tasks:", error.status);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<section id="center" className="tasks-page">
			<div>
				{/* <h1>Tasks</h1> */}
				{!props.token && <p>Please sign in to create new tasks.</p>}
				{props.token && <TaskNavBar token={props.token} />}
			</div>
			{props.token && (
				<div className={location.pathname === "/tasks" ? "tasks-container" : "task-container"}>
					<Outlet context={{ tasks, refetch: fetchTasks }} />
				</div>
			)}
		</section>
	);
}

export default Tasks;
