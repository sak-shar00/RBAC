import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Login from "../pages/Login";
import AdminHome from "../pages/Admin/Home";
import AdminUsers from "../pages/Admin/Users";
import AdminProjects from "../pages/Admin/Projects";
import AdminTasks from "../pages/Admin/Tasks";
import ManagerHome from "../pages/Manager/Home";
import ManagerProjects from "../pages/Manager/Projects";
import ManagerTasks from "../pages/Manager/Tasks";
import DeveloperHome from "../pages/Developer/Home";
import DeveloperTasks from "../pages/Developer/Tasks";

export default function AppRoutes() {
  const { token, role } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={!token ? <Login /> : <Navigate to={`/${role}/home`} />} />

        {/* Admin routes */}
        <Route path="/admin/home" element={token && role === "admin" ? <AdminHome /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={token && role === "admin" ? <AdminUsers /> : <Navigate to="/" />} />
        <Route path="/admin/projects" element={token && role === "admin" ? <AdminProjects /> : <Navigate to="/" />} />
        <Route path="/admin/tasks" element={token && role === "admin" ? <AdminTasks /> : <Navigate to="/" />} />

        {/* Manager routes */}
        <Route path="/manager/home" element={token && role === "manager" ? <ManagerHome /> : <Navigate to="/" />} />
        <Route path="/manager/projects" element={token && role === "manager" ? <ManagerProjects /> : <Navigate to="/" />} />
        <Route path="/manager/tasks" element={token && role === "manager" ? <ManagerTasks /> : <Navigate to="/" />} />

        {/* Developer routes */}
        <Route path="/developer/home" element={token && role === "developer" ? <DeveloperHome /> : <Navigate to="/" />} />
        <Route path="/developer/tasks" element={token && role === "developer" ? <DeveloperTasks /> : <Navigate to="/" />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
