import { BrowserRouter, Routes, Route } from "react-router-dom";

// View Component Imports
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WorkspacePage from "./pages/WorkspacePage";
import ResetPasswordConfirmPage from "./pages/ForgotPasswordPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC GATEWAY ENTRY VIEWS */}
                <Route path="/" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirmPage />} />
                
                {/* PROTECTED SYSTEM MAPPED ECOSYSTEM VIEWS */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-task" element={<AddTaskPage />} />
                
                {/* Fixed: Unified view target handling details mapping securely directly inside workspace */}
                <Route path="/workspace/:taskId" element={<WorkspacePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;