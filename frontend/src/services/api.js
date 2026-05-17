import axios from "axios";
import LoginPage from "../pages/LoginPage";

const api=axios.create({
    baseURL:"http://localhost:8000/api/",
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access");

    console.log("TOKEN:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
export default api;