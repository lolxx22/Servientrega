import { TarifaEnvio } from '@prisma/client';

export interface CreateTarifaEnvioDTO {
  ciudadOrigen: string;
  ciudadDestino: string;
  tarifaDocumento: number;
  tarifaKg: number;
  tarifaMinima: number;
  pesoMaximo?: number;
}

export interface ITarifaEnvioRepository {
  findById(id: number): Promise<TarifaEnvio | null>;
  findByRoute(ciudadOrigen: string, ciudadDestino: string): Promise<TarifaEnvio | null>;
  findAll(): Promise<TarifaEnvio[]>;
  create(data: CreateTarifaEnvioDTO): Promise<TarifaEnvio>;
  count(): Promise<number>;
}
