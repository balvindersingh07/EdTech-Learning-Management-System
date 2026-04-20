import {
  authService,
  type AuthResponse,
  type LoginPayload,
  type SignupPayload,
  type SignupPendingResponse,
} from "@/services/authService";
import type { User, UserRole } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type AuthErrorSource = "password" | "signup" | null;

export interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  /** Which flow produced `error` (login vs signup) */
  errorSource: AuthErrorSource;
}

const tokenFromStorage = localStorage.getItem("lms_token");
const userFromStorage = localStorage.getItem("lms_user");

const initialState: AuthState = {
  user: userFromStorage ? (JSON.parse(userFromStorage) as User) : null,
  token: tokenFromStorage,
  status: "idle",
  error: null,
  errorSource: null,
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.errorSource = null;
      state.status = "idle";
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
    },
    switchRole(state, action: { payload: UserRole }) {
      if (!state.user) return;
      state.user = { ...state.user, role: action.payload };
      localStorage.setItem("lms_user", JSON.stringify(state.user));
    },
    /** Dismiss stale errors when the user edits the login form */
    clearAuthMessages(state) {
      if (state.status === "loading") return;
      state.error = null;
      state.errorSource = null;
      if (state.status === "failed") state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorSource = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.errorSource = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("lms_token", action.payload.token);
        localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
        state.errorSource = "password";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorSource = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        const p = action.payload as AuthResponse | SignupPendingResponse;
        if ("pending" in p && p.pending) {
          state.status = "idle";
          state.error = null;
          state.errorSource = null;
          state.user = null;
          state.token = null;
          return;
        }
        const ok = p as AuthResponse;
        state.status = "succeeded";
        state.errorSource = null;
        state.user = ok.user;
        state.token = ok.token;
        localStorage.setItem("lms_token", ok.token);
        localStorage.setItem("lms_user", JSON.stringify(ok.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Signup failed";
        state.errorSource = "signup";
      });
  },
});

export const { logout, switchRole, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
