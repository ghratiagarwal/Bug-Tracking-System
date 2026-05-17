import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-task" element={<AddTaskPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;