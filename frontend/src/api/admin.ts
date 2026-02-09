import API from "./axiosInstance";

// User Management
export const fetchUsersAPI = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const createUserAPI = async (data: { name: string; email: string; password: string; role: string }) => {
  const res = await API.post("/admin/users", data);
  return res.data;
};

export const toggleUserAPI = async (id: string) => {
  const res = await API.patch(`/admin/users/${id}`);
  return res.data;
};

// Project Management
export const createProjectAPI = async (data: { name: string; description?: string }) => {
  const res = await API.post("/admin/projects", data);
  return res.data;
};

export const assignProjectAPI = async (projectId: string, managerId: string) => {
  const res = await API.patch(`/admin/projects/${projectId}`, { managerId });
  return res.data;
};

// Task Management
export const fetchAllTasksAPI = async () => {
  const res = await API.get("/admin/tasks");
  return res.data;
};

// Dashboard Stats
export const fetchDashboardStatsAPI = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

export const updateTaskAPI = async (id: string, data: Record<string, unknown>) => {
  const res = await API.put(`/admin/tasks/${id}`, data);
  return res.data;
};

export const deleteTaskAPI = async (id: string) => {
  const res = await API.delete(`/admin/tasks/${id}`);
  return res.data;
};
