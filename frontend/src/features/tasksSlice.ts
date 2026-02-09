import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "./tasks";
import { 
  fetchAdminTasksAPI, 
  fetchManagerTasksAPI, 
  fetchDeveloperTasksAPI,
  createTaskAPI, 
  updateTaskAPI,
  updateManagerTaskAPI,
  deleteTaskAPI, 
  assignTaskAPI,
  updateDeveloperTaskStatusAPI 
} from "./tasks";

interface TasksState { 
  tasks: Task[]; 
  loading: boolean; 
  error: string | null; 
}

const initialState: TasksState = { tasks: [], loading: false, error: null };

// Fetch all tasks (admin)
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchAdminTasksAPI();
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
    return rejectWithValue(errorMessage);
  }
});

// Fetch manager tasks
export const fetchManagerTasks = createAsyncThunk("tasks/fetchManagerTasks", async (filters: { status?: string; project?: string; assignedTo?: string } = {}, { rejectWithValue }) => {
  try {
    const data = await fetchManagerTasksAPI(filters);
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
    return rejectWithValue(errorMessage);
  }
});

// Fetch developer tasks
export const fetchDeveloperTasks = createAsyncThunk("tasks/fetchDeveloperTasks", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchDeveloperTasksAPI();
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
    return rejectWithValue(errorMessage);
  }
});

// Create task (manager)
export const createTask = createAsyncThunk("tasks/createTask", async (data: { title: string; description?: string; project?: string; assignedTo?: string }, { rejectWithValue }) => {
  try {
    const result = await createTaskAPI(data);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create task";
    return rejectWithValue(errorMessage);
  }
});

// Update task (admin)
export const updateTask = createAsyncThunk("tasks/updateTask", async ({ taskId, data }: { taskId: string; data: { title?: string; description?: string; status?: "pending" | "in-progress" | "completed" } }, { rejectWithValue }) => {
  try {
    const result = await updateTaskAPI(taskId, data);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update task";
    return rejectWithValue(errorMessage);
  }
});

// Update task (manager)
export const updateManagerTask = createAsyncThunk("tasks/updateManagerTask", async ({ taskId, data }: { taskId: string; data: { title?: string; description?: string; status?: "pending" | "in-progress" | "completed"; project?: string } }, { rejectWithValue }) => {
  try {
    const result = await updateManagerTaskAPI(taskId, data);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update task";
    return rejectWithValue(errorMessage);
  }
});

// Delete task (admin)
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId: string, { rejectWithValue }) => {
  try {
    await deleteTaskAPI(taskId);
    return taskId;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
    return rejectWithValue(errorMessage);
  }
});

// Assign task (manager)
export const assignTask = createAsyncThunk("tasks/assignTask", async ({ taskId, userId }: { taskId: string; userId: string }, { rejectWithValue }) => {
  try {
    const result = await assignTaskAPI(taskId, userId);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to assign task";
    return rejectWithValue(errorMessage);
  }
});

// Update task status (developer)
export const updateTaskStatus = createAsyncThunk("tasks/updateTaskStatus", async ({ taskId, status }: { taskId: string; status: string }, { rejectWithValue }) => {
  try {
    const result = await updateDeveloperTaskStatusAPI(taskId, status);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update status";
    return rejectWithValue(errorMessage);
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<unknown>) => { state.loading = false; state.error = action.payload as string; })
      
      // Fetch manager tasks
      .addCase(fetchManagerTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchManagerTasks.fulfilled, (state, action: PayloadAction<Task[]>) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchManagerTasks.rejected, (state, action: PayloadAction<unknown>) => { state.loading = false; state.error = action.payload as string; })
      
      // Fetch developer tasks
      .addCase(fetchDeveloperTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDeveloperTasks.fulfilled, (state, action: PayloadAction<Task[]>) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchDeveloperTasks.rejected, (state, action: PayloadAction<unknown>) => { state.loading = false; state.error = action.payload as string; })
      
      // Create task
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => { state.tasks.push(action.payload); })
      
      // Update task (admin)
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      
      // Update task (manager)
      .addCase(updateManagerTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      
      // Assign task
      .addCase(assignTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      
      // Update task status (developer)
      .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      });
  },
});

export default tasksSlice.reducer;
