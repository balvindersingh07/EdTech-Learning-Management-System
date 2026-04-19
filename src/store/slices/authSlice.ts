import { authService, type LoginPayload, type SignupPayload } from "@/services/authService";
import type { User, UserRole } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const tokenFromStorage = localStorage.getItem("lms_token");
const userFromStorage = localStorage.getItem("lms_user");

const initialState: AuthState = {
  user: userFromStorage ? (JSON.parse(userFromStorage) as User) : null,
  token: tokenFromStorage,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    return await authService.login(payload);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : "Login failed");
  }
});

export const signup = createAsyncThunk("auth/signup", async (payload: SignupPayload, { rejectWithValue }) => {
  try {
    return await authService.signup(payload);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : "Signup failed");
  }
});

export const loginWithMicrosoft = createAsyncThunk(
  "auth/loginMicrosoft",
  async (idToken: string, { rejectWithValue }) => {
    try {
      return await authService.loginWithMicrosoft(idToken);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Microsoft login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
    },
    switchRole(state, action: { payload: UserRole }) {
      if (!state.user) return;
      state.user = { ...state.user, role: action.payload };
      localStorage.setItem("lms_user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("lms_token", action.payload.token);
        localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("lms_token", action.payload.token);
        localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Signup failed";
      })
      .addCase(loginWithMicrosoft.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithMicrosoft.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("lms_token", action.payload.token);
        localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      })
      .addCase(loginWithMicrosoft.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Microsoft login failed";
      });
  },
});

export const { logout, switchRole } = authSlice.actions;
export default authSlice.reducer;
