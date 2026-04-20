import type { User, UserRole } from "@/types";
import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupPendingResponse {
  pending: true;
  message: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/v1/auth/login", payload);
    return data;
  },
  async signup(payload: SignupPayload): Promise<AuthResponse | SignupPendingResponse> {
    const { data } = await api.post<AuthResponse | SignupPendingResponse>("/v1/auth/signup", payload);
    return data;
  },
};
