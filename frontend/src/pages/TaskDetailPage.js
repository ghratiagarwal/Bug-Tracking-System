import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

function TaskDetailPage() {

    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [task, setTask] = useState(null);
    const [newComment, setNewComment] = useState("");
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
    const addComment = async() => {
        try {
            await api.post("comments/", {
                task: id,
                user: currentUser.id,
                comment: newComment
            });
            setNewComment("");
            fetchComments();
        }
        catch(error) {
            console.log(error);
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

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1>{task.title}</h1>

            <p>{task.description}</p>

            <p>Status: {task.status}</p>

            <p>Priority: {task.priority}</p>

            <p>Task Type: {task.task_type}</p>

            <h2>Comments</h2>
            {comments.map((comment) => (
                <div key={comment.id} style={{ 
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px"}}>
                    <p>{comment.comment}</p>
                    <small>User ID: {comment.user}</small>
                    </div>
                ))}

                <textarea placeholder="Write comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}/><br /><br />
                <button onClick={addComment}>Add Comment</button>
                </div>
                );

}

export default TaskDetailPage;