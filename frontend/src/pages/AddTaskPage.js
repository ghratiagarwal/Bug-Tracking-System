import { useState,useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddTaskPage(){
     const navigate=useNavigate();
     const [title,setTitle] = useState("");
     const [description,setDescription]=useState("");
     const [screenshot,setScreenshot] = useState(null);
     const [status,setStatus ] =useState("TODO");
     const [priority,setPriority ] =useState("LOW");
     const [tasktype,setTasktype ] =useState("");
     const [users, setUsers] = useState([]);
     const [assignedTo,setAssignedTo]=useState("");
     const fetchUsers = async () => {
        try {
            const response = await api.get("users/");
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);
        formData.append("task_type", tasktype);
        formData.append("priority", priority);
        formData.append("assigned_to", Number(assignedTo));

        // add screenshot only if selected
        if (screenshot) {
            formData.append("screenshot", screenshot);
        }

        await api.post("tasks/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        alert("Task Created Successfully");
        navigate("/dashboard");

    } catch (error) {
        console.log(error.response?.data || error);
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
                <input type="file" onChange={(e) => setScreenshot(e.target.files[0])}/><br></br>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Assign User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})</option>
                    ))}
                </select><br></br><br></br>
                <input type="text" placeholder="Task Type" value={tasktype} onChange={(e) => setTasktype(e.target.value)}/>
                <br/><br/>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <br/><br/>
                <select value={status} onChange={(e) => setStatus(e.target.value)} >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="Done">DONE</option>
                </select>
                <br/><br/>
                <button type="submit">Create Task</button>
            </form>

        </div>

    );
}

export default AddTaskPage;