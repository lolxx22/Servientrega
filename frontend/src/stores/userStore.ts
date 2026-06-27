import { create } from 'zustand';
import { userService } from '../services/user.service';
import type { User } from '../types';

interface UserState {
  users: User[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  load: (page?: number) => Promise<void>;
  changeRol: (id: number, rol: 'ADMIN' | 'OPERATOR') => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setPage: (page: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  total: 0,
  page: 1,
  limit: 12,
  isLoading: false,
  error: null,

  load: async (page?: number) => {
    const p = page ?? get().page;
    set({ isLoading: true, error: null });
    try {
      const { users, total } = await userService.findAll(p, get().limit);
      set({ users, total, page: p, isLoading: false });
    } catch {
      set({ error: 'Error al cargar usuarios', isLoading: false });
    }
  },

  changeRol: async (id, rol) => {
    await userService.changeRol(id, rol);
    set(s => ({ users: s.users.map(u => u.id === id ? { ...u, rol } : u) }));
  },

  deleteUser: async (id) => {
    await userService.deleteUser(id);
    set(s => ({ users: s.users.filter(u => u.id !== id), total: s.total - 1 }));
  },

  setPage: (page) => { get().load(page); },
}));
