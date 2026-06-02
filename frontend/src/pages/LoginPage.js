import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // UI state constraint

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents standard browser page reload behavior
        setLoading(true);

        try {
            // Pointing directly to our clean login endpoint
            const response = await api.post("login/", {
                username: username,
                password: password
            });

            // Extract the standard DRF Token payload securely
            if (response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                
                // Optional: Store non-sensitive user metadata for quick profile access in UI
                localStorage.setItem("userRole", response.data.user.role);
                localStorage.setItem("userFullName", response.data.user.full_name);
            }

            navigate("/dashboard"); // Redirect directly to core interior interior dashboard
        } catch (error) {
            console.error("Authentication Error Data:", error.response?.data);
            
            // Checking for descriptive error messages from backend validation channels
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Invalid Credentials. Please check your username and password.");
            }
        } finally {
            setLoading(false); // Release UI loading block
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>System Authentication</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                /><br /><br />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                /><br /><br />
                
                {/* Submit trigger locked to asynchronous operational flight state */}
                <button type="submit" disabled={loading}>
                    {loading ? "Authenticating..." : "Login"}
                </button>
                <br /><br />
                
                {/* Declared explicitly as type="button" to isolate execution context from form submission */}
                <button type="button" onClick={() => navigate("/forgot-password")}>
                    Forgot Password?
                </button>
                <br /><br />
                
                <span>Not already signed in? </span>
                <button type="button" onClick={() => navigate("/")}>
                    Signup
                </button>
            </form>
        </div>
    );
}

export default LoginPage;