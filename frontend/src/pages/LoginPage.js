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
            console.log(error);

        }
        };
        return (
            <div> 
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
    export default LoginPage;

