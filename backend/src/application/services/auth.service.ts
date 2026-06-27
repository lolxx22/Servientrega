import { UsuarioRepository } from '../../infrastructure/database/repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO, UserResponse, ChangeRolInput } from '../dto/user.dto';
import { RolUsuario } from '@prisma/client';
import { comparePassword } from '../../shared/utils/bcrypt';
import { generateToken } from '../../shared/utils/jwt';
import { AuthResponse, LoginInput } from '../dto/auth.dto';
import { UnauthorizedError, NotFoundError } from '../../domain/errors';

const usuarioRepository = new UsuarioRepository();

export class UserService {
  async register(data: CreateUserDTO): Promise<UserResponse> {
    return usuarioRepository.create(data);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await usuarioRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Credenciales invalidas');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales invalidas');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      rol: user.rol,
    });

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    };
  }

  async getProfile(userId: number): Promise<UserResponse> {
    const user = await usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      createdAt: user.createdAt,
    };
  }

  async findAll(page?: number, limit?: number) {
    return usuarioRepository.findAll(page, limit);
  }

  async update(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    return usuarioRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return usuarioRepository.delete(id);
  }

  async changeRol(id: number, data: ChangeRolInput): Promise<UserResponse> {
    const user = await usuarioRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return usuarioRepository.update(id, { rol: data.rol });
  }

  async count(): Promise<number> {
    return usuarioRepository.count();
  }
}
