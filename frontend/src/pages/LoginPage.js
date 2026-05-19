import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function LoginPage(){
    const [username,setUsername]=useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await api.post("token/", {
                username,password
            });
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            navigate("/dashboard");
        }
        catch(error){
            console.log(error.response?.data);
            alert("Invalid Credentials");
        }
        };
        return (
            <div> 
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/><br></br>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/><br></br>
                    <button type="submit">Login</button><br></br>
                    <button onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
                    <br></br>
                    Not already signed in??<button onClick={() => navigate("/")}>Signup</button><br /><br />
                </form>
            </div>
        );
    }
    export default LoginPage;

