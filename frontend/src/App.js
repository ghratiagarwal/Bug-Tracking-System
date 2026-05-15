import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/add-task" element={<AddTaskPage />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;