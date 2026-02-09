import API from "./axiosInstance";

// Fetch all projects (admin view)
export const fetchProjectsAPI = async () => {
  const res = await API.get("/admin/projects");
  return res.data;
};

// Create project (admin)
export const createProjectAPI = async (data: { name: string; description?: string }) => {
  const res = await API.post("/admin/projects", data);
  return res.data;
};

// Assign manager to project (admin)
export const assignProjectAPI = async (projectId: string, managerId: string) => {
  const res = await API.patch(`/admin/projects/${projectId}`, { managerId });
  return res.data;
};

// Get manager's projects
export const fetchManagerProjectsAPI = async () => {
  const res = await API.get("/manager/projects");
  return res.data;
};
