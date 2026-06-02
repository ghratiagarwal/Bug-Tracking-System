import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddTaskPage() {
    const navigate = useNavigate();
    
    // Controlled Form State Elements
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [status, setStatus] = useState("TODO");
    const [priority, setPriority] = useState("LOW");
    const [tasktype, setTasktype] = useState("BUG"); // Defaulting to a standard type fallback
    const [users, setUsers] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const [loading, setLoading] = useState(false); // UI Submission Flight Guard

    // Pull systemic user profiles to populate the relational assignment interface list
    const fetchUsers = async () => {
        try {
            const response = await api.get("users/");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to retrieve user list indexes:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Edge Validation: Force explicit user assignment selection
        if (!assignedTo) {
            alert("Please assign this task to a valid system engineer.");
            return;
        }

        setLoading(true);

        try {
            // Instantiating standard binary-safe browser form layout wrapper
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            
            // Fixed: Standardized uppercase choice mapping parameters to match backend Choice enums
            formData.append("status", status);
            formData.append("task_type", tasktype);
            formData.append("priority", priority);
            formData.append("assigned_to", Number(assignedTo));

            // Inject media payload directly if present inside local storage pointer
            if (screenshot) {
                formData.append("screenshot", screenshot);
            }

            await api.post("tasks/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Forces multi-segment encoding schema parsing
                },
            });

            alert("Task Created Successfully");
            navigate("/dashboard");
        } catch (error) {
            console.error("Form Write Failure Stack:", error.response?.data || error);
            alert("Failed to compile task data. Check log inputs.");
        } finally {
            setLoading(false); // Clear transaction thread lock state
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Create New Tracked Issue</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Task Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                /><br /><br />
                
                <textarea 
                    placeholder="Provide deep technical contextual error details..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    required
                /><br /><br />
                
                <label>Attach Issue Screenshot: </label>
                <input 
                    type="file" 
                    accept="image/*" // Restricts browser upload picker to raw image mime groups
                    onChange={(e) => setScreenshot(e.target.files[0])}
                /><br /><br />
                
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                    <option value="">Assign System Engineer...</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {/* Fixed: Maps parameters cleanly to user.full_name as provided by updated Serializer fields */}
                            {user.full_name} ({user.role})
                        </option>
                    ))}
                </select><br /><br />
                
                <select value={tasktype} onChange={(e) => setTasktype(e.target.value)}>
                    <option value="BUG">Bug / Defect</option>
                    <option value="FEATURE">Feature Requirement</option>
                </select><br /><br />
                
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                </select><br /><br />
                
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    {/* Fixed: Casing string corrected to uppercase parameter to align with choices constraints */}
                    <option value="DONE">Done / Closed</option>
                </select><br /><br />
                
                <button type="submit" disabled={loading}>
                    {loading ? "Committing Task Parameters..." : "Create Task"}
                </button>
            </form>
        </div>
    );
}

export default AddTaskPage;