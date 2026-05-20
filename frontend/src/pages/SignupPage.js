import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SignupPage(){
    const navigate = useNavigate();
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [name,setName]=useState("");
    const [role,setRole]=useState("");
    const [skills,setSkills]=useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try { 
            await api.post("register/", {
                username: username,
                password:password,
                email:email,
                name:name,
                role:role,
                skills:skills

            })
        alert("Account Created Successfully");
        navigate("/login");
    }
    catch(error) {
        if (error.response?.data?.username) {
             alert(error.response.data.username[0]);
            }
        else {
             alert("Signup failed");
            }
    }
};

return (
    <div>
    <h1>Signup</h1>
    <form onSubmit={handleSignup}>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/><br /><br />
    <input type="password"placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/><br /><br />
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/><br /><br />
    <input type="text" placeholder="Full Name"  value={name} onChange={(e) => setName(e.target.value)}/><br /><br />
    <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} /><br /><br />
    <textarea placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)}/><br /><br />
    <button type="submit"> Signup</button><br></br>
    already signed in??<button onClick={() => navigate("/login")}>Login</button><br /><br />
    </form>
    </div>

    );
}

export default SignupPage;
