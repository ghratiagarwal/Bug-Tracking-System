import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPasswordConfirmPage() {
    const navigate = useNavigate();
    // Extracts uid and token variables directly from the dynamic URL path
    const { uid, token } = useParams(); 
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordConfirm = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Submitting the token parameters along with the new password for token validation matches
            await api.post("forgot-password-confirm/", {
                uid: uid,
                token: token,
                new_password: newPassword
            });

            alert("Your password has been successfully updated.");
            navigate("/login");
        } catch (error) {
            console.error("Token Reset Failure Data:", error.response?.data || error);
            alert("The link is invalid or has expired. Please request a new password reset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Set New Password</h1>
            <form onSubmit={handlePasswordConfirm}>
                <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                /><br /><br />

                <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                /><br /><br />

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting Password..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordConfirmPage;