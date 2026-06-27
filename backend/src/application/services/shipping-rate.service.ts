import { TarifaEnvioRepository } from '../../infrastructure/database/repositories/shipping-rate.repository';
import { CreateTarifaEnvioDTO } from '../../domain/repositories/shipping-rate.repository';

const tarifaEnvioRepository = new TarifaEnvioRepository();

export class TarifaEnvioService {
  async findById(id: number) {
    return tarifaEnvioRepository.findById(id);
  }

  async findByRoute(ciudadOrigen: string, ciudadDestino: string) {
    return tarifaEnvioRepository.findByRoute(ciudadOrigen, ciudadDestino);
  }

  async findAll() {
    return tarifaEnvioRepository.findAll();
  }

  async create(data: CreateTarifaEnvioDTO) {
    return tarifaEnvioRepository.create(data);
  }

  async count() {
    return tarifaEnvioRepository.count();
  }

  async calculateCost(ciudadOrigen: string, ciudadDestino: string, peso: number, tipoProducto?: string) {
    const rate = await this.findByRoute(ciudadOrigen, ciudadDestino);

    if (!rate) {
      return null;
    }

    const esDocumento = tipoProducto?.toLowerCase().includes('documento');
    const tarifaBase = esDocumento ? rate.tarifaDocumento : rate.tarifaMinima;
    const costoPeso = peso * rate.tarifaKg;
    const costoTotal = Math.max(tarifaBase + costoPeso, rate.tarifaMinima);

    return {
      tarifaBase,
      costoPeso,
      costoTotal: Math.round(costoTotal * 100) / 100,
      pesoMaximo: rate.pesoMaximo,
    };
  }
}
