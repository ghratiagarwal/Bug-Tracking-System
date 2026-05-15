import {useState} from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddTaskPage(){
     const navigate=useNavigate();
     const [title,setTitle] = useState("");
     const [description,setDescription]=useState("");
     const [status,setStatus ] =useState("To Do");
     const [priority,setPriority ] =useState("Low");
     const [tasktype,setTasktype ] =useState("");
     const [assignedTo,setAssignedTo]=useState("");
     const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await api.post('tasks/',{
                title:title,
                description:description,
                status:status,
                task_type:tasktype,
                priority:priority,
                assigned_to:assignedTo
            });
            alert("Task Created Successfully");
            navigate("/dashboard");
        }
        catch(error) {
            console.log(error.response.data);
        }
     };

    return (

        <div>

            <h1>Add Task </h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <br/><br/>
                <textarea type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <br/><br/>
                <input type="text" placeholder="Assigned To" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}/>
                <br/><br/>
                <input type="text" placeholder="Task Type" value={tasktype} onChange={(e) => setTasktype(e.target.value)}/>
                <br/><br/>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <br/><br/>
                <select value={status} onChange={(e) => setStatus(e.target.value)} >
                    <option value="TO Do">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <br/><br/>
                <button type="submit">Create Task</button>
            </form>

        </div>

    );
}

export default AddTaskPage;