import API from "./axiosInstance";

// Get all projects for manager
export const getManagerProjects = async () => {
  const res = await API.get("/manager/projects");
  return res.data;
};

// Get manager stats
export const getManagerStats = async () => {
  const res = await API.get("/manager/stats");
  return res.data;
};

// Get all developers
export const getDevelopers = async () => {
  const res = await API.get("/manager/developers");
  return res.data;
};

// Get all tasks for manager
export const getManagerTasks = async (filters?: {
  status?: string;
  project?: string;
  assignedTo?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.project) params.append("project", filters.project);
  if (filters?.assignedTo) params.append("assignedTo", filters.assignedTo);

  const res = await API.get(`/manager/tasks?${params.toString()}`);
  return res.data;
};

// Get single task
export const getManagerTaskById = async (taskId: string) => {
  const res = await API.get(`/manager/tasks/${taskId}`);
  return res.data;
};

// Create task
export const createTask = async (taskData: {
  title: string;
  description?: string;
  project: string;
  assignedTo?: string;
}) => {
  const res = await API.post("/manager/tasks", taskData);
  return res.data;
};

// Update task
export const updateManagerTask = async (
  taskId: string,
  taskData: {
    title?: string;
    description?: string;
    status?: string;
    project?: string;
  }
) => {
  const res = await API.put(`/manager/tasks/${taskId}`, taskData);
  return res.data;
};

// Assign task to developer
export const assignTask = async (taskId: string, assignedTo: string) => {
  const res = await API.put(`/manager/tasks/${taskId}/assign`, { assignedTo });
  return res.data;
};

// Delete task
export const deleteManagerTask = async (taskId: string) => {
  const res = await API.delete(`/manager/tasks/${taskId}`);
  return res.data;
};

