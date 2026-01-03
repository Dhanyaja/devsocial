import api from "../utils/axios";
import type { User } from "../types/user";

interface AuthResponse {
  token: string;
  user: User;
}

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
};

export const getMeApi = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const refreshUserApi = async (): Promise<User> => {
  const { data } = await api.get("/users/me");
  return data;
};
