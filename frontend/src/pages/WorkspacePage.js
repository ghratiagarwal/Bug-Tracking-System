import { useEffect,useState } from "react";
import api from  "../services/api";
import "./WorkspacePage.css";

function WorkspacePage() {
    const [ view,setView ] = useState("creator");
    const [ tasks,setTasks ] = useState([]);
    const fetchTasks = async () => {
        try{
            const type= 
            view ==="creator"
            ? "created_by_me" : "assigned_to_me";
            const response=await api.get(
                `tasks/?type=${type}`
            );
            setTasks(response.data);
        } catch(error)
        {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTasks();

    },[view]);
    return (

    <div
        className={
            view === "creator"
                ? "workspace creator-theme"
                : "workspace assigned-theme"
        }
    >

        {/* HEADER */}

        <div className="workspace-header">

            <h1>
                {view === "creator"
                    ? "Creator Workspace"
                    : "Assigned Workspace"}
            </h1>

            <div className="toggle-buttons">

                <button
                    className={
                        view === "creator"
                            ? "active"
                            : ""
                    }
                    onClick={() => setView("creator")}
                >
                    Creator View
                </button>

                <button
                    className={
                        view === "assigned"
                            ? "active"
                            : ""
                    }
                    onClick={() => setView("assigned")}
                >
                    Assigned View
                </button>

            </div>

        </div>

        {/* TASK GRID */}

        <div className="task-grid">

            {tasks.map((task) => (

                <div
                    key={task.id}
                    className="task-card"
                >

                    <div className="task-content">

                        {/* TITLE */}

                        <h2>{task.title}</h2>

                        {/* DESCRIPTION */}

                        <p>{task.description}</p>

                        {/* SCREENSHOT */}

                        {task.screenshot && (
                            <>

                                <div className="image-label">
                                    Screenshot
                                </div>

                                <a
                                    href={task.screenshot}
                                    target="_blank"
                                    rel="noreferrer"
                                >

                                    <div className="task-image-wrapper">

                                        <img
                                            src={task.screenshot}
                                            alt="task"
                                            className="task-image"
                                        />

                                    </div>

                                </a>

                            </>
                        )}

                        {/* TAGS */}

                        <div className="task-tags">

                            <span>
                                {task.priority}
                            </span>

                            <span>
                                {task.status}
                            </span>

                            <span>
                                {task.task_type}
                            </span>

                        </div>

                        {/* COMMENTS */}

                        <div className="comments-section">

                            <h4>Comments</h4>

                            {task.comments &&
                                task.comments.map((comment) => (

                                    <div
                                        key={comment.id}
                                        className="comment"
                                    >

                                        <p>
                                            {comment.comment}
                                        </p>

                                        {comment.screenshot && (

                                            <a
                                                href={comment.screenshot}
                                                target="_blank"
                                                rel="noreferrer"
                                            >

                                                <img
                                                    src={comment.screenshot}
                                                    alt="comment"
                                                    className="comment-image"
                                                />

                                            </a>

                                        )}

                                    </div>

                                ))}

                            <textarea
                                placeholder="Reply..."
                            />

                            <button>
                                Reply
                            </button>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    </div>

);
}

export default WorkspacePage;