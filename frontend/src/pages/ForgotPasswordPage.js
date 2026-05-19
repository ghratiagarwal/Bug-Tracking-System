import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                "forgot-password/",
                {
                    username: username,
                    new_password: newPassword
                }
            );
            alert("Password reset successful");
            navigate("/login");
        }
        catch(error) {
            console.log(error.response.data);
        }
    };
    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleReset}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/><br /><br />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/><br /><br />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
export default ForgotPasswordPage;