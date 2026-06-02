import "./DashboardPage.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DashboardPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState("creator"); // Toggle between 'creator' and 'assigned'
    const [loading, setLoading] = useState(false);

    // Derived State Filters (O(N) computed lookups per render pass)
    const todoTasks = tasks.filter((task) => task.status === "TODO");
    const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = tasks.filter((task) => task.status === "DONE");

    // Memoizing fetch operation to eliminate unnecessary garbage collection passes
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const type = view === "creator" ? "created_by_me" : "assigned_to_me";
            const response = await api.get(`tasks/?type=${type}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to sync board collection query components:", error);
        } finally {
            setLoading(false);
        }
    }, [view]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handle asynchronous inline status modification overrides
    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            // Fixed: Standardized uppercase path routing definitions targeting tasks namespace
            await api.patch(`tasks/${taskId}/`, {
                status: newStatus,
            });
            fetchTasks(); // Force refresh to re-evaluate derived matrix column sets
        } catch (error) {
            console.error("Status state update failed:", error.response?.data || error);
            alert("Could not update task status.");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="title-area">
                    <h1>Project Board</h1>
                    <p className="subtitle">Track development lifecycle statuses across nodes</p>
                </div>
                <button className="create-btn" onClick={() => navigate("/add-task")}>
                    <span>+</span> Create Task
                </button>
            </header>

            <div className="toggle-container">
                <button 
                    className={`toggle-btn ${view === "creator" ? "active" : ""}`}
                    onClick={() => setView("creator")}
                >
                    Created by Me
                </button>
                <button 
                    className={`toggle-btn ${view === "assigned" ? "active" : ""}`}
                    onClick={() => setView("assigned")}
                >
                    Assigned to Me
                </button>
            </div>

            {loading && <div className="board-loading-overlay">Refreshing system dashboard state...</div>}

            <div className="board-grid">
                {/* TODO COLUMN */}
                <div className="board-column">
                    <div className="column-banner status-todo">
                        <h2>To Do</h2>
                        <span className="badge">{todoTasks.length}</span>
                    </div>
                    <div className="column-card-holder">
                        {todoTasks.map((task) => (
                            <div key={task.id} className="task-card" onClick={() => navigate(`/workspace/${task.id}`)}>
                                <div className="card-top">
                                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                    {task.task_type && <span className="type-tag">{task.task_type}</span>}
                                </div>
                                <h3>{task.title}</h3>
                                {task.screenshot && (
                                    <div className="image-wrapper">
                                        <img src={task.screenshot} alt="Issue evidence asset block" className="task-preview-img" />
                                    </div>
                                )}
                                <div className="card-bottom" onClick={(e) => e.stopPropagation()}>
                                    <select value={task.status} onChange={(e) => handleStatusUpdate(task.id, e.target.value)}>
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IN PROGRESS COLUMN */}
                <div className="board-column">
                    <div className="column-banner status-progress">
                        <h2>In Progress</h2>
                        <span className="badge">{inProgressTasks.length}</span>
                    </div>
                    <div className="column-card-holder">
                        {inProgressTasks.map((task) => (
                            <div key={task.id} className="task-card" onClick={() => navigate(`/workspace/${task.id}`)}>
                                <div className="card-top">
                                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                    {task.task_type && <span className="type-tag">{task.task_type}</span>}
                                </div>
                                <h3>{task.title}</h3>
                                {task.screenshot && (
                                    <div className="image-wrapper">
                                        <img src={task.screenshot} alt="Issue evidence asset block" className="task-preview-img" />
                                    </div>
                                )}
                                <div className="card-bottom" onClick={(e) => e.stopPropagation()}>
                                    <select value={task.status} onChange={(e) => handleStatusUpdate(task.id, e.target.value)}>
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DONE COLUMN */}
                <div className="board-column">
                    <div className="column-banner status-done">
                        <h2>Done</h2>
                        <span className="badge">{doneTasks.length}</span>
                    </div>
                    <div className="column-card-holder">
                        {doneTasks.map((task) => (
                            <div key={task.id} className="task-card complete-card" onClick={() => navigate(`/workspace/${task.id}`)}>
                                <div className="card-top">
                                    <span className="priority-tag done">Closed</span>
                                </div>
                                <h3>{task.title}</h3>
                                <div className="ownership-metadata">
                                    {/* Fixed: Accessing nested user details correctly via .full_name */}
                                    <p><span>Creator:</span> {task.created_by?.full_name || "System"}</p>
                                    <p><span>Assignee:</span> {task.assigned_to?.full_name || "Unassigned"}</p>
                                </div>
                                <div className="card-bottom" onClick={(e) => e.stopPropagation()}>
                                    <select value={task.status} onChange={(e) => handleStatusUpdate(task.id, e.target.value)}>
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;