import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { fetchProjectsAPI, createProjectAPI, assignProjectAPI, fetchManagerProjectsAPI } from "../api/projects";

interface Project {
  _id: string;
  name: string;
  description?: string;
  manager?: { _id: string; name: string; email: string };
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = { projects: [], loading: false, error: null };

// Fetch all projects (admin)
export const fetchProjects = createAsyncThunk("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchProjectsAPI();
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects";
    return rejectWithValue(errorMessage);
  }
});

// Fetch manager's projects
export const fetchManagerProjects = createAsyncThunk("projects/fetchManagerProjects", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchManagerProjectsAPI();
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects";
    return rejectWithValue(errorMessage);
  }
});

// Create project (admin)
export const createProject = createAsyncThunk("projects/createProject", async (data: { name: string; description?: string }, { rejectWithValue }) => {
  try {
    const result = await createProjectAPI(data);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create project";
    return rejectWithValue(errorMessage);
  }
});

// Assign manager to project (admin)
export const assignProject = createAsyncThunk("projects/assignProject", async ({ projectId, managerId }: { projectId: string; managerId: string }, { rejectWithValue }) => {
  try {
    const result = await assignProjectAPI(projectId, managerId);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to assign project";
    return rejectWithValue(errorMessage);
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => { state.loading = false; state.projects = action.payload; })
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<unknown>) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchManagerProjects.fulfilled, (state, action: PayloadAction<Project[]>) => { state.loading = false; state.projects = action.payload; })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => { state.projects.push(action.payload); })
      .addCase(assignProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects = state.projects.map(p => p._id === action.payload._id ? action.payload : p);
      });
  },
});

export default projectsSlice.reducer;
