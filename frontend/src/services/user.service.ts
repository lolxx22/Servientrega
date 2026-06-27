import api from './api';
import type { ApiResponse, User } from '../types';

export const userService = {
  async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const { data } = await api.get<ApiResponse<User[]>>(`/users?page=${page}&limit=${limit}`);
    return { users: data.data || [], total: data.pagination?.total || 0 };
  },

  async changeRol(id: number, rol: 'ADMIN' | 'OPERATOR'): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/users/${id}/rol`, { rol });
    return data.data!;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
