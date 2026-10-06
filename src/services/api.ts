import axios, { AxiosError, AxiosInstance } from "axios";
import { ID } from "../_metronic/helpers";
import type {
  AuthUser,
  LoginResponse,
  User,
  UsersQueryResponse,
} from "./types";
import { mockAuthAPI, mockUserAPI } from "./mock/mockApi";

/**
 * API layer ກາງຂອງ project.
 * - ທຸກ request ໄປ backend ຕ້ອງຜ່ານໄຟລ໌ນີ້ເທົ່ານັ້ນ (ຫ້າມ axios.get ກະແຈກກະຈາຍໃນ component)
 * - VITE_USE_MOCK_API=true → ໃຊ້ mock (localStorage) ແທນ backend ຈິງ
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = `${import.meta.env.BASE_URL}auth/login`;
    }
    return Promise.reject(error);
  }
);

const errorMessage = (error: unknown, fallback: string) =>
  (axios.isAxiosError(error) && error.response?.data?.message) || fallback;

// ===================== Auth =====================
const httpAuthAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(errorMessage(error, "Login failed"));
    }
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<{ data: AuthUser }>("/auth/me");
    return data.data;
  },
};

// ===================== Users =====================
const httpUserAPI = {
  getUsers: async (query: string): Promise<UsersQueryResponse> => {
    const { data } = await api.get<UsersQueryResponse>(`/users?${query}`);
    return data;
  },

  getUserById: async (id: ID): Promise<User | undefined> => {
    const { data } = await api.get<{ data: User }>(`/users/${id}`);
    return data.data;
  },

  createUser: async (user: User): Promise<User | undefined> => {
    try {
      const { data } = await api.post<{ data: User }>("/users", user);
      return data.data;
    } catch (error) {
      throw new Error(errorMessage(error, "Error creating user"));
    }
  },

  updateUser: async (user: User): Promise<User | undefined> => {
    try {
      const { data } = await api.put<{ data: User }>(`/users/${user.id}`, user);
      return data.data;
    } catch (error) {
      throw new Error(errorMessage(error, "Error updating user"));
    }
  },

  deleteUser: async (id: ID): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  deleteSelectedUsers: async (ids: Array<ID>): Promise<void> => {
    await Promise.all(ids.map((id) => api.delete(`/users/${id}`)));
  },
};

export const authAPI = USE_MOCK ? mockAuthAPI : httpAuthAPI;
export const userAPI = USE_MOCK ? mockUserAPI : httpUserAPI;
