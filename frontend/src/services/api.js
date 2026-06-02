import axios from "axios";

// Instantiating standard Axios global configuration node
const api = axios.create({
    baseURL: "http://localhost:8000/api/",
});

// Outbound Request Interceptor Pipeline
api.interceptors.request.use(
    (config) => {
        // Updated: Pulling from our verified standardized localStorage token key name
        const token = localStorage.getItem("authToken");
        
        // Dynamic endpoint check matrix to bypass attaching headers for public entry routes
        const isPublicEndpoint = 
            config.url.includes("register") || 
            config.url.includes("login") || 
            config.url.includes("forgot-password-request") ||
            config.url.includes("forgot-password-confirm");

        // Inject authentication token strings dynamically into valid outbound streams
        if (token && !isPublicEndpoint) {
            // Fixed: Standardized keyword signature prefix precisely to 'Token' to match DRF system layout
            config.headers.Authorization = `Token ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;