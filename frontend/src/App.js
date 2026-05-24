import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WorkspacePage from "./pages/WorkspacePage";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-task" element={<AddTaskPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
                <Route path="/workspace" element={<WorkspacePage/>}/>
                
            </Routes>

        </BrowserRouter>
    );
}

export default App;