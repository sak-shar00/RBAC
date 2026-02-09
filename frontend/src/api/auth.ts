import API from "./axiosInstance";

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data; // { token, role, userId }
};