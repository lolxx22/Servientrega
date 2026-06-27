import { Usuario, RolUsuario } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../../application/dto/user.dto';

export interface IUsuarioRepository {
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findAll(page?: number, limit?: number): Promise<{ usuarios: UserResponse[]; total: number }>;
  create(data: CreateUserDTO): Promise<UserResponse>;
  update(id: number, data: UpdateUserDTO): Promise<UserResponse>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}
