import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email invalido'),
  password: z
    .string()
    .min(1, 'La contrasena es requerida'),
});

export const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email invalido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'La contrasena debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contrasena debe contener al menos una mayuscula')
    .regex(/[a-z]/, 'La contrasena debe contener al menos una minuscula')
    .regex(/[0-9]/, 'La contrasena debe contener al menos un numero'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthResponse {
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
  token: string;
}
