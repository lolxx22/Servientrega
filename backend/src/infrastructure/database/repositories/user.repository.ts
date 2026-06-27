import { prisma } from '../../../config/database';
import { IUsuarioRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../../../application/dto/user.dto';
import { hashPassword } from '../../../shared/utils/bcrypt';
import { NotFoundError, ConflictError } from '../../../domain/errors';
import { Usuario, RolUsuario } from '@prisma/client';

export class UsuarioRepository implements IUsuarioRepository {
  async findById(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async findAll(page = 1, limit = 10): Promise<{ usuarios: UserResponse[]; total: number }> {
    const skip = (page - 1) * limit;
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.usuario.count(),
    ]);
    return { usuarios, total };
  }

  async create(data: CreateUserDTO): Promise<UserResponse> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('El email ya esta registrado');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        rol: data.rol || RolUsuario.OPERATOR,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    });
    return user;
  }

  async update(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    await prisma.usuario.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return prisma.usuario.count();
  }
}
