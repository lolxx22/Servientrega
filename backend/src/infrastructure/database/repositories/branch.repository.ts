import { prisma } from '../../../config/database';
import { ISucursalRepository, CreateSucursalDTO } from '../../../domain/repositories/branch.repository';
import { Sucursal } from '@prisma/client';

export class SucursalRepository implements ISucursalRepository {
  async findById(id: number): Promise<Sucursal | null> {
    return prisma.sucursal.findUnique({ where: { id } });
  }

  async findByCodigo(codigo: string): Promise<Sucursal | null> {
    return prisma.sucursal.findUnique({ where: { codigo } });
  }

  async findByCiudad(ciudad: string): Promise<Sucursal[]> {
    return prisma.sucursal.findMany({
      where: { ciudad, activa: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findAll(): Promise<Sucursal[]> {
    return prisma.sucursal.findMany({
      where: { activa: true },
      orderBy: { ciudad: 'asc' },
    });
  }

  async create(data: CreateSucursalDTO): Promise<Sucursal> {
    return prisma.sucursal.create({ data });
  }

  async count(): Promise<number> {
    return prisma.sucursal.count();
  }
}
