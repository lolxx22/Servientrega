import { SucursalRepository } from '../../infrastructure/database/repositories/branch.repository';
import { CreateSucursalDTO } from '../../domain/repositories/branch.repository';

const sucursalRepository = new SucursalRepository();

export class SucursalService {
  async findById(id: number) {
    return sucursalRepository.findById(id);
  }

  async findByCodigo(codigo: string) {
    return sucursalRepository.findByCodigo(codigo);
  }

  async findByCiudad(ciudad: string) {
    return sucursalRepository.findByCiudad(ciudad);
  }

  async findAll() {
    return sucursalRepository.findAll();
  }

  async create(data: CreateSucursalDTO) {
    return sucursalRepository.create(data);
  }

  async count() {
    return sucursalRepository.count();
  }
}
