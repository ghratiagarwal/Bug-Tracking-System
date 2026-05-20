import "./DashboardPage.css";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function DashboardPage(){
    const [tasks,setTasks]=useState([]);
    const todoTasks = tasks.filter((task) => task.status === "TODO");
    const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = tasks.filter((task) => task.status === "DONE");
    const navigate = useNavigate();
    useEffect(() => {
        fetchTasks();
    },[]);
    const fetchTasks = async () =>{
        try {
            const token = localStorage.getItem("access");
            const response = await api.get("tasks/");
            setTasks(response.data);
        }catch (error){
        console.error(error);
        }
    };

    // DELETE TASK
    const deleteTask = async(id) => {
        try {
            await api.delete(`tasks/${id}/`);
            setTasks(tasks.filter((task) => task.id !== id));
        }
        catch(error) {
            console.log(error);
        }

    };

    // UPDATE TASK STATUS
    const updateStatus = async(id) => {
        try {
            await api.put(`tasks/${id}/`, {
                status: "Done"
            });
            fetchTasks();
        }
        catch(error) {
            console.log(error);
        }
    };

    return (
  <div className="dashboard-container">

    <div className="dashboard-header">
      <h1>Project Board</h1>

      <button
        className="create-btn"
        onClick={() => navigate("/add-task")}
      >
        + Create Task
      </button>
    </div>

    <div className="board">

      {/* TODO COLUMN */}
      <div className="column">
        <div className="column-header todo">
          <span>TODO</span>
          <span>{todoTasks.length}</span>
        </div>

        {todoTasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            <h3>{task.title}</h3>

            <p className="priority">{task.priority}</p>

            <select
              value={task.status}
              onChange={async (e) => {
                try {
                  await api.patch(`tasks/${task.id}/`, {
                    status: e.target.value,
                  });

                  fetchTasks();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        ))}
      </div>

      {/* IN PROGRESS COLUMN */}
      <div className="column">
        <div className="column-header progress">
          <span>IN PROGRESS</span>
          <span>{inProgressTasks.length}</span>
        </div>

        {inProgressTasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            <h3>{task.title}</h3>

            <p className="priority">{task.priority}</p>

            <select
              value={task.status}
              onChange={async (e) => {
                try {
                  await api.patch(`tasks/${task.id}/`, {
                    status: e.target.value,
                  });

                  fetchTasks();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        ))}
      </div>

      {/* DONE COLUMN */}
      <div className="column">
        <div className="column-header done">
          <span>DONE</span>
          <span>{doneTasks.length}</span>
        </div>

        {doneTasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            <h3>{task.title}</h3>

            <p className="priority">{task.priority}</p>

            <select
              value={task.status}
              onChange={async (e) => {
                try {
                  await api.patch(`tasks/${task.id}/`, {
                    status: e.target.value,
                  });

                  fetchTasks();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        ))}
      </div>

    </div>
  </div>
);
    }
    export default DashboardPage;