import axios from "axios";
import LoginPage from "../pages/LoginPage";

const api=axios.create({
    baseURL:"http://localhost:8000/api/",
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access");
    if (
            token &&
            !config.url.includes("register") &&
            !config.url.includes("token")
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;