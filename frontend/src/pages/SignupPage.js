import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SignupPage() {
    const navigate = useNavigate();
    
    // Controlled component state declarations
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false); // UI state indicating request flight

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevents standard browser page reload behavior
        setLoading(true);

        try {
            // Mapping payload parameters precisely to match Django's RegisterSerializer fields
            const response = await api.post("register/", {
                username: username,
                password: password,
                email: email,
                first_name: firstName,
                last_name: lastName,
                role: role,
                skills: skills
            });
            if (response.data.token) {
                localStorage.setItem("authToken", response.data.token);
            }

            alert("Account Created Successfully");
            navigate("/dashboard");
        } catch (error) {
            if (error.response?.data) {
                const serverErrors = error.response.data;
                // Extract the first error message dynamically from whichever field failed validation
                const firstErrorKey = Object.keys(serverErrors)[0];
                const errorMessage = serverErrors[firstErrorKey];
                
                alert(`${firstErrorKey}: ${Array.isArray(errorMessage) ? errorMessage[0] : errorMessage}`);
            } else {
                alert("Network communication failure. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>System Registration</h1>
            <form onSubmit={handleSignup}>
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
                
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                /><br /><br />
                
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                /><br /><br />

                <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                /><br /><br />
                
                <input 
                    type="text" 
                    placeholder="Professional Role (e.g. Frontend Dev)" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required 
                /><br /><br />
                
                <textarea 
                    placeholder="Core Technical Skills (comma separated)" 
                    value={skills} 
                    onChange={(e) => setSkills(e.target.value)}
                /><br /><br />
                
                {/* Submit button state managed dynamically via tracking variable */}
                <button type="submit" disabled={loading}>
                    {loading ? "Registering System User..." : "Signup"}
                </button>
                <br /><br />
                
                <span>Already signed in? </span>
                {/* Explicit declaration of type="button" to prevent accidental form submissions */}
                <button type="button" onClick={() => navigate("/login")}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default SignupPage;