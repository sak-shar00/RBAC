import API from "./axiosInstance";

// Get assigned tasks
export const getDeveloperTasks = async () => {
  const res = await API.get("/developer/tasks");
  return res.data;
};

// Get developer stats
export const getDeveloperStats = async () => {
  const res = await API.get("/developer/stats");
  return res.data;
};

// Update task status
export const updateTaskStatus = async (taskId: string, status: string) => {
  const res = await API.patch(`/developer/tasks/${taskId}/status`, { status });
  return res.data;
};

