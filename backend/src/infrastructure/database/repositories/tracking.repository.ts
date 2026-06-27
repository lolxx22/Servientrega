import { prisma } from '../../../config/database';
import { ISeguimientoRepository, CreateSeguimientoDTO } from '../../../domain/repositories/tracking.repository';
import { Seguimiento } from '@prisma/client';

export class SeguimientoRepository implements ISeguimientoRepository {
  async findByEnvioId(envioId: number): Promise<Seguimiento[]> {
    return prisma.seguimiento.findMany({
      where: { envioId },
      orderBy: { fecha: 'desc' },
    });
  }

  async getLatestByEnvioId(envioId: number): Promise<Seguimiento | null> {
    return prisma.seguimiento.findFirst({
      where: { envioId },
      orderBy: { fecha: 'desc' },
    });
  }

  async create(data: CreateSeguimientoDTO): Promise<Seguimiento> {
    return prisma.seguimiento.create({ data });
  }
}
