import { EstadoEnvio, EstadoSeguimiento } from '@prisma/client';

export interface CreateEnvioDTO {
  numeroGuia: string;
  creadoPorId?: number;
  remitenteNombre: string;
  remitenteTelefono: string;
  remitenteDireccion: string;
  destinatarioNombre: string;
  destinatarioTelefono: string;
  destinatarioDireccion: string;
  origen: string;
  destino: string;
  peso: number;
  tipoProducto?: string;
  costoEnvio?: number;
}

export interface UpdateEnvioDTO {
  estado?: EstadoEnvio;
  sucursalId?: number;
  fechaRecoleccion?: Date;
  fechaEntrega?: Date;
}

export interface EnvioResponse {
  id: number;
  numeroGuia: string;
  creadoPorId: number | null;
  remitenteNombre: string;
  remitenteTelefono: string;
  remitenteDireccion: string;
  destinatarioNombre: string;
  destinatarioTelefono: string;
  destinatarioDireccion: string;
  origen: string;
  destino: string;
  peso: number;
  tipoProducto: string | null;
  costoEnvio: number | null;
  estado: EstadoEnvio;
  sucursalId: number | null;
  fechaCreacion: Date;
  fechaRecoleccion: Date | null;
  fechaEntrega: Date | null;
}

export interface TrackingInfo {
  numeroGuia: string;
  estado: string;
  ubicacion: string;
  descripcion: string;
  fechaUltimaActualizacion: Date;
  fechaEstimadaEntrega: Date | null;
}

export interface CreateSeguimientoDTO {
  envioId: number;
  estado: EstadoSeguimiento;
  sucursalId?: number;
  ubicacion: string;
  descripcion: string;
  observaciones?: string;
}
