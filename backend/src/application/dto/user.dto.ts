import { z } from 'zod';
import { RolUsuario } from '@prisma/client';

export interface CreateUserDTO {
  nombre: string;
  email: string;
  password: string;
  rol?: RolUsuario;
}

export interface UpdateUserDTO {
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
}

export interface UserResponse {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  createdAt: Date;
}

export const changeRolSchema = z.object({
  rol: z.nativeEnum(RolUsuario, {
    errorMap: () => ({ message: 'Rol no valido. Valores permitidos: ADMIN, OPERATOR' }),
  }),
});

export type ChangeRolInput = z.infer<typeof changeRolSchema>;
