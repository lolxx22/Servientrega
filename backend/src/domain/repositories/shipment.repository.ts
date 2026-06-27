import { Envio, EstadoEnvio } from '@prisma/client';
import { CreateEnvioDTO, UpdateEnvioDTO, EnvioResponse } from '../../application/dto/shipment.dto';

export interface IEnvioRepository {
  findById(id: number): Promise<Envio | null>;
  findByTrackingNumber(numeroGuia: string): Promise<Envio | null>;
  findAll(page?: number, limit?: number, status?: EstadoEnvio): Promise<{ envios: EnvioResponse[]; total: number }>;
  create(data: CreateEnvioDTO): Promise<Envio>;
  update(id: number, data: UpdateEnvioDTO): Promise<Envio>;
  count(): Promise<number>;
  countByStatus(status: EstadoEnvio): Promise<number>;
}
