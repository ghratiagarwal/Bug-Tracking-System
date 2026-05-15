import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DashboardPage(){
    const [tasks,setTasks]=useState([]);
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

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => navigate("/add-task")}>Add Task</button>
            {tasks.map((task) =>(
                <div key={task.id}>
                    <table border='1'>
                    <tr>
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Status</th></tr><tr>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.status}</td>
                    </tr>
                    </table>
                </div>
            ))}
        </div>
    );
    }
    export default DashboardPage;