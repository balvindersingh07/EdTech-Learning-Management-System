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

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/v1/auth/login", payload);
    return data;
  },
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/v1/auth/signup", payload);
    return data;
  },
  async loginWithMicrosoft(idToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/v1/auth/azure", { idToken });
    return data;
  },
};
