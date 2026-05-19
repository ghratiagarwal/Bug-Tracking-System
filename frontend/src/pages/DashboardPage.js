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

            // REMOVE TASK FROM UI IMMEDIATELY
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

            // REFRESH TASK LIST
            fetchTasks();

        }

        catch(error) {

            console.log(error);

        }

    };


    return (
        <div style={{display: "flex",gap: "20px",alignItems: "flex-start"}}>
        <h1>Dashboard</h1>
        <button onClick={() => navigate("/add-task")}>Create Task</button>
        <br /><br />
    {/* TODO */}

    <div style={{ flex: 1 }}>

        <h2>TODO</h2>

        {todoTasks.map((task) => (

            <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer"
                }}
            >

                <h3>{task.title}</h3>

                <p>{task.priority}</p>

            </div>

        ))}

    </div>

    {/* IN PROGRESS */}

    <div style={{ flex: 1 }}>

        <h2>IN PROGRESS</h2>

        {inProgressTasks.map((task) => (

            <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer"
                }}
            >

                <h3>{task.title}</h3>

                <p>{task.priority}</p>

            </div>

        ))}

    </div>

    {/* DONE */}

    <div style={{ flex: 1 }}>

        <h2>DONE</h2>

        {doneTasks.map((task) => (

            <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer"
                }}
            >

                <h3>{task.title}</h3>

                <p>{task.priority}</p>

                <select value={task.status}
                onChange={async (e) => {
                    try {
                        await api.patch(`tasks/${task.id}/`, {
                            status: e.target.value
                        });
                        fetchTasks();
                    }
                    catch(error) {
                        console.log(error);
                    }
                    }}>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>

            </div>

        ))}

    </div>

</div>
    );
    }
    export default DashboardPage;