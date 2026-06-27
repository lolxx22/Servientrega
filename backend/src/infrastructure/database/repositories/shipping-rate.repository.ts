import { prisma } from '../../../config/database';
import { ITarifaEnvioRepository, CreateTarifaEnvioDTO } from '../../../domain/repositories/shipping-rate.repository';
import { TarifaEnvio } from '@prisma/client';

export class TarifaEnvioRepository implements ITarifaEnvioRepository {
  async findById(id: number): Promise<TarifaEnvio | null> {
    return prisma.tarifaEnvio.findUnique({ where: { id } });
  }

  async findByRoute(ciudadOrigen: string, ciudadDestino: string): Promise<TarifaEnvio | null> {
    return prisma.tarifaEnvio.findUnique({
      where: {
        ciudadOrigen_ciudadDestino: { ciudadOrigen, ciudadDestino },
      },
    });
  }

  async findAll(): Promise<TarifaEnvio[]> {
    return prisma.tarifaEnvio.findMany({
      where: { activa: true },
      orderBy: [{ ciudadOrigen: 'asc' }, { ciudadDestino: 'asc' }],
    });
  }

  async create(data: CreateTarifaEnvioDTO): Promise<TarifaEnvio> {
    return prisma.tarifaEnvio.create({ data });
  }

  async count(): Promise<number> {
    return prisma.tarifaEnvio.count();
  }
}
