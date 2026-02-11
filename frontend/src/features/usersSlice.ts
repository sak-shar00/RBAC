import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { fetchUsersAPI, createUserAPI, toggleUserAPI } from "../api/admin";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = { users: [], loading: false, error: null };

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchUsersAPI();
    return data;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
    return rejectWithValue(errorMessage);
  }
});

export const createUser = createAsyncThunk("users/createUser", async (data: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
  try {
    const result = await createUserAPI(data);
    return result;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create user";
    return rejectWithValue(errorMessage);
  }
});

export const toggleUser = createAsyncThunk("users/toggleUser", async (id: string, { rejectWithValue }) => {
  try {
    const data = await toggleUserAPI(id);
    return { id, ...data };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to toggle user";
    return rejectWithValue(errorMessage);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<unknown>) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => { state.users.push(action.payload); })
      .addCase(createUser.rejected, (state, action: PayloadAction<unknown>) => { state.error = action.payload as string; })
      .addCase(toggleUser.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.users = state.users.map(user => 
          user._id === action.payload.id ? { ...user, isActive: !user.isActive } : user
        );
      });
  },
});

export const { clearError } = usersSlice.actions;

export default usersSlice.reducer;
