import { Seguimiento, EstadoSeguimiento } from '@prisma/client';

export interface CreateSeguimientoDTO {
  envioId: number;
  estado: EstadoSeguimiento;
  sucursalId?: number;
  ubicacion: string;
  descripcion: string;
  observaciones?: string;
}

export interface ISeguimientoRepository {
  findByEnvioId(envioId: number): Promise<Seguimiento[]>;
  getLatestByEnvioId(envioId: number): Promise<Seguimiento | null>;
  create(data: CreateSeguimientoDTO): Promise<Seguimiento>;
}
