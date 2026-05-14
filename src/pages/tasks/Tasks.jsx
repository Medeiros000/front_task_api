import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { taskService } from "../../api/taskService";
import TaskNavBar from "../../components/TaskNavBar";
import { use, useEffect, useState } from "react";

function Tasks(props) {
	const [tasks, setTasks] = useState([]);
	const location = useLocation();
	const [spinner, setSpinner] = useState(true);
  const { isTokenExpired, signOut } = props;
  const navigate = useNavigate();
  const expiredToken = isTokenExpired(props.token);

	const fetchTasks = async () => {
		if (!props.token) {
			console.warn("No token provided. Cannot fetch tasks.");
			return;
		}
		try {
			const data = await taskService.getAll();
			setTasks(data);
		} catch (error) {
			console.error("Error fetching tasks:", error.status);
		}
		setSpinner(false);
	};

	useEffect(() => {
    if (expiredToken) {
      signOut();      
      return;
    }
		fetchTasks();
	}, []);

	function Spinner() {
		return (
			<svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
				<circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
			</svg>
		);
	}

	return (
		<section id="center" className="tasks-page">
			
				{!props.token && <p>Please sign in to view, edit, delete or create new tasks.</p>}
				{props.token && <TaskNavBar token={props.token} />}
				{(tasks.length === 0 && !expiredToken) && <Spinner />}
			
			{props.token && (
				<div className={location.pathname === "/tasks" ? "tasks-container" : "task-container"}>
					<Outlet context={{ tasks, refetch: fetchTasks }} />
				</div>
			)}
		</section>
	);
}

export default Tasks;
