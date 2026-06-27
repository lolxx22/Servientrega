import { Sucursal } from '@prisma/client';

export interface CreateSucursalDTO {
  nombre: string;
  codigo: string;
  ciudad: string;
  direccion: string;
  telefono?: string;
}

export interface ISucursalRepository {
  findById(id: number): Promise<Sucursal | null>;
  findByCodigo(codigo: string): Promise<Sucursal | null>;
  findByCiudad(ciudad: string): Promise<Sucursal[]>;
  findAll(): Promise<Sucursal[]>;
  create(data: CreateSucursalDTO): Promise<Sucursal>;
  count(): Promise<number>;
}
