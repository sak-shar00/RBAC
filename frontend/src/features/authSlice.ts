import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "../api/auth";

interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { token: null, role: null, userId: null, loading: false, error: null };

export const login = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const data = await loginUser(email, password);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;