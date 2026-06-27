import { prisma } from '../../../config/database';
import { IEnvioRepository } from '../../../domain/repositories/shipment.repository';
import { CreateEnvioDTO, UpdateEnvioDTO, EnvioResponse } from '../../../application/dto/shipment.dto';
import { NotFoundError } from '../../../domain/errors';
import { Envio, EstadoEnvio } from '@prisma/client';

export class EnvioRepository implements IEnvioRepository {
  async findById(id: number): Promise<Envio | null> {
    return prisma.envio.findUnique({ where: { id } });
  }

  async findByTrackingNumber(numeroGuia: string): Promise<Envio | null> {
    return prisma.envio.findUnique({ where: { numeroGuia } });
  }

  async findAll(page = 1, limit = 20, status?: EstadoEnvio): Promise<{ envios: EnvioResponse[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = status ? { estado: status } : {};

    const [envios, total] = await Promise.all([
      prisma.envio.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: 'desc' },
      }),
      prisma.envio.count({ where }),
    ]);
    return { envios, total };
  }

  async create(data: CreateEnvioDTO): Promise<Envio> {
    return prisma.envio.create({ data });
  }

  async update(id: number, data: UpdateEnvioDTO): Promise<Envio> {
    const envio = await this.findById(id);
    if (!envio) {
      throw new NotFoundError('Envio no encontrado');
    }
    return prisma.envio.update({ where: { id }, data });
  }

  async count(): Promise<number> {
    return prisma.envio.count();
  }

  async countByStatus(status: EstadoEnvio): Promise<number> {
    return prisma.envio.count({ where: { estado: status } });
  }
}
