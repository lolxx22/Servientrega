import api from './api';
import type { ApiResponse, User, AuthResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    return data.data!;
  },

  async register(nombre: string, email: string, password: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/auth/register', {
      nombre,
      email,
      password,
    });
    return data.data!;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/profile');
    return data.data!;
  },
};
