import API from "../api/axiosInstance";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  project?: { _id: string; name: string };
  assignedTo?: { _id: string; name: string; email: string };
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface TaskData {
  title: string;
  description?: string;
  project?: string;
  assignedTo?: string;
  status?: "pending" | "in-progress" | "completed";
}

// Admin: Fetch all tasks
export const fetchAdminTasksAPI = async (): Promise<Task[]> => {
  const res = await API.get("/admin/tasks");
  return res.data;
};

// Manager: Fetch tasks
export const fetchManagerTasksAPI = async (filters?: { status?: string; project?: string; assignedTo?: string }): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.project) params.append("project", filters.project);
  if (filters?.assignedTo) params.append("assignedTo", filters.assignedTo);
  
  const res = await API.get(`/manager/tasks?${params.toString()}`);
  return res.data;
};

// Developer: Fetch my tasks
export const fetchDeveloperTasksAPI = async (): Promise<Task[]> => {
  const res = await API.get("/developer/tasks");
  return res.data;
};

// Create task (manager)
export const createTaskAPI = async (data: TaskData): Promise<Task> => {
  const res = await API.post("/manager/tasks", data);
  return res.data;
};

// Update task (admin/manager)
export const updateTaskAPI = async (taskId: string, data: Partial<TaskData>): Promise<Task> => {
  const res = await API.put(`/admin/tasks/${taskId}`, data);
  return res.data;
};

// Update task (manager)
export const updateManagerTaskAPI = async (taskId: string, data: Partial<TaskData>): Promise<Task> => {
  const res = await API.put(`/manager/tasks/${taskId}`, data);
  return res.data;
};

// Delete task (admin/manager)
export const deleteTaskAPI = async (taskId: string): Promise<void> => {
  await API.delete(`/admin/tasks/${taskId}`);
};

// Assign task (manager)
export const assignTaskAPI = async (taskId: string, userId: string): Promise<Task> => {
  const res = await API.put(`/manager/tasks/${taskId}/assign`, { assignedTo: userId });
  return res.data;
};

// Update task status (developer)
export const updateDeveloperTaskStatusAPI = async (taskId: string, status: string): Promise<Task> => {
  const res = await API.patch(`/developer/tasks/${taskId}/status`, { status });
  return res.data;
};

// Get developer stats
export const getDeveloperStatsAPI = async (): Promise<{
  assignedTasks: number;
  inProgress: number;
  completed: number;
  pending: number;
}> => {
  const res = await API.get("/developer/stats");
  return res.data;
};
