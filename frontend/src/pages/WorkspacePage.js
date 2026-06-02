import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./WorkspacePage.css";

function WorkspacePage() {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [reply, setReply] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Fetch individual task dataset containing nested comment logs
    const fetchTask = useCallback(async () => {
        try {
            const response = await api.get(`tasks/${taskId}/`);
            setTask(response.data);
        } catch (error) {
            console.error("Failed to load workspace contextual details:", error.response?.data || error);
            if (error.response?.status === 404) {
                alert("The requested task target does not exist or has been removed.");
                navigate("/dashboard");
            }
        }
    }, [taskId, navigate]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    // Dispatch a new comment string block back to the relational task index
    const handleReply = async () => {
        if (!reply.trim()) return; // Edge Guard: Block empty comment submissions
        setSubmitting(true);

        try {
            await api.post("comments/", {
                task: task.id,
                comment: reply.trim()
            });
            setReply(""); // Reset form field input value string
            await fetchTask(); // Reload task dataset asynchronously to display the fresh comment thread
        } catch(error) {
            console.error("Comment delivery pipeline rejected execution:", error.response?.data || error);
            alert("Could not append commentary to active instance node.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!task) {
        return (
            <div className="workspace-loading-shell">
                <div className="spinner"></div>
                <p>Initializing secure workspace pipeline node...</p>
            </div>
        );
    }

    return (
        <div className="workspace-container">
            {/* ACTION NAV BAR */}
            <div className="workspace-navigation">
                <button type="button" className="back-link-btn" onClick={() => navigate("/dashboard")}>
                    ← Return to Project Board
                </button>
            </div>

            <div className="workspace-split-layout">
                {/* LEFT CONTEXT PANEL: CRITICAL RECORD DESCRIPTION INFO */}
                <div className="workspace-main-panel">
                    <div className="task-header-block">
                        <div className="meta-capsule-row">
                            <span className={`badge-capsule priority-${task.priority?.toLowerCase()}`}>
                                {task.priority} Priority
                            </span>
                            <span className="badge-capsule type-tag">
                                {task.task_type || "TASK"}
                            </span>
                            <span className={`badge-capsule status-${task.status?.toLowerCase().replace('_', '-')}`}>
                                {task.status}
                            </span>
                        </div>
                        <h1>{task.title}</h1>
                    </div>

                    <div className="task-body-narrative">
                        <h3>Context Details</h3>
                        <p>{task.description || "No supplemental details provided for this entry."}</p>
                    </div>

                    {task.screenshot && (
                        <div className="task-asset-section">
                            <h3>Attached Technical Evidence</h3>
                            <div className="image-display-frame">
                                <a href={task.screenshot} target="_blank" rel="noreferrer" title="Click to view full asset resolution">
                                    <img src={task.screenshot} alt="System execution evidence attachment" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT CONTEXT PANEL: COLLABORATIVE ACTIVITY THREADS */}
                <div className="workspace-sidebar-panel">
                    <div className="comments-module">
                        <h3>Discussion Thread</h3>
                        
                        <div className="comments-scroll-chamber">
                            {task.comments && task.comments.length > 0 ? (
                                task.comments.map((comment) => (
                                    <div key={comment.id} className="comment-bubble">
                                        <div className="comment-meta">
                                            {/* Fixed: References comment.user.full_name matching the refactored schema validation format */}
                                            <span className="author-name">{comment.user?.full_name || "Unknown Operator"}</span>
                                            <span className="timestamp">
                                                {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className="comment-text">
                                            <p>{comment.comment}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-thread-placeholder">
                                    <p>No activity records logged. Initialize dialogue below.</p>
                                </div>
                            )}
                        </div>

                        {/* INTERACTIVE INPUT REGION */}
                        <div className="comment-composer">
                            <textarea
                                placeholder="Input diagnostic logging notes or follow-up task parameters..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                disabled={submitting}
                            />
                            <div className="composer-actions">
                                <button 
                                    type="button"
                                    onClick={handleReply} 
                                    disabled={submitting || !reply.trim()}
                                    className="submit-reply-btn"
                                >
                                    {submitting ? "Posting Note..." : "Commit Comment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkspacePage;