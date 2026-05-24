import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

function TaskDetailPage() {

    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [task, setTask] = useState(null);
    const [comment, setComment] = useState("");
    const [commentScreenshot, setCommentScreenshot] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const fetchTask = async() => {
        try {
            const response = await api.get(`tasks/${id}/`);
            setTask(response.data);
        }
        catch(error) {
            console.log(error);
        }
    };

    const fetchComments = async() => {
        try {
            const response = await api.get("comments/");
            const filteredComments = response.data.filter((comment) => comment.task === parseInt(id)
        );
        setComments(filteredComments);
    }
        
        catch(error) {
        console.log(error);}
    };
    const addComment = async () => {

        if (!comment.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("task", task.id);
            formData.append("comment", comment);
            if (commentScreenshot) {
                formData.append("screenshot", commentScreenshot);
            }
            await api.post("comments/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setComment("");
            setCommentScreenshot(null);
            fetchComments();
        } catch (error) {
            console.log(error.response?.data || error);
        }
    };

    const fetchCurrentUser = async() => {
        try {
            const response = await api.get("me/");
            setCurrentUser(response.data);
        }
        catch(error) {
            console.log(error);
        }
    };



    useEffect(() => {

        fetchTask();
        fetchComments();
        fetchCurrentUser();

    }, []);
    if(!task) {
        return <h2>Loading...</h2>
    }

    return (
        <div style={{ padding: "20px" }}>
            {/* TASK DETAILS */}

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "30px"
                }}
            >
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            {task.screenshot && (
                <img
                src={task.screenshot}
                alt="task screenshot"
                style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", marginTop: "10px"}}/>
                )}
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Task Type: {task.task_type}</p>
            <h2>Comments</h2></div>
            {comments.map((commentItem) => (
                <div key={commentItem.id} style={{ 
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                    background: "#fafafa"}}>
                    <p>{commentItem.comment}</p>

                    {commentItem.screenshot && (
                        <img
                            src={commentItem.screenshot}
                            alt="comment screenshot"
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                marginTop: "10px",
                                borderRadius: "8px"
                            }}
                        />
                    )}

                    <br />

                    <small>
                        User ID: {commentItem.user}
                    </small>

                </div>
            ))}

            {/* ADD COMMENT */}

            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    background: "#fff"
                }}
            >

                <h3>Add Comment</h3>

                <textarea
                    placeholder="Write comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="file"
                    onChange={(e) =>
                        setCommentScreenshot(e.target.files[0])
                    }
                />

                <br /><br />

                <button
                    onClick={addComment}
                    style={{
                        background: "#0052cc",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer"
                        }}>
                    Add Comment
                </button>

            </div>

        </div>
    );
}

export default TaskDetailPage;