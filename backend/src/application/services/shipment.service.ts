import { EnvioRepository } from '../../infrastructure/database/repositories/shipment.repository';
import { SeguimientoRepository } from '../../infrastructure/database/repositories/tracking.repository';
import { CreateEnvioDTO, EnvioResponse, TrackingInfo } from '../dto/shipment.dto';
import { generateTrackingNumber } from '../../shared/utils/trackingNumber';
import { NotFoundError } from '../../domain/errors';
import { EstadoEnvio, EstadoSeguimiento } from '@prisma/client';

const envioRepository = new EnvioRepository();
const seguimientoRepository = new SeguimientoRepository();

export class EnvioService {
  async createDirect(data: {
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
  }): Promise<{ envio: EnvioResponse; numeroGuia: string }> {
    const numeroGuia = generateTrackingNumber();

    const envio = await envioRepository.create({
      numeroGuia,
      creadoPorId: data.creadoPorId,
      remitenteNombre: data.remitenteNombre,
      remitenteTelefono: data.remitenteTelefono,
      remitenteDireccion: data.remitenteDireccion,
      destinatarioNombre: data.destinatarioNombre,
      destinatarioTelefono: data.destinatarioTelefono,
      destinatarioDireccion: data.destinatarioDireccion,
      origen: data.origen,
      destino: data.destino,
      peso: data.peso,
      tipoProducto: data.tipoProducto,
      costoEnvio: data.costoEnvio,
    });

    await seguimientoRepository.create({
      envioId: envio.id,
      ubicacion: data.origen,
      descripcion: 'Guia creada. Envio en espera de recoleccion.',
      estado: EstadoSeguimiento.ORDEN_CREADA,
    });

    return { envio, numeroGuia };
  }

  async findById(id: number) {
    const envio = await envioRepository.findById(id);
    if (!envio) {
      throw new NotFoundError('Envio no encontrado');
    }
    return envio;
  }

  async findByTrackingNumber(numeroGuia: string): Promise<TrackingInfo | null> {
    const envio = await envioRepository.findByTrackingNumber(numeroGuia);
    if (!envio) {
      return null;
    }

    const latestTracking = await seguimientoRepository.getLatestByEnvioId(envio.id);

    return {
      numeroGuia: envio.numeroGuia,
      estado: envio.estado,
      ubicacion: latestTracking?.ubicacion || 'Sin ubicacion',
      descripcion: latestTracking?.descripcion || 'Sin actualizaciones',
      fechaUltimaActualizacion: latestTracking?.fecha || envio.fechaCreacion,
      fechaEstimadaEntrega: envio.fechaEntrega,
    };
  }

  async findAll(page?: number, limit?: number, status?: EstadoEnvio) {
    return envioRepository.findAll(page, limit, status);
  }

  async updateStatus(id: number, estado: EstadoEnvio, ubicacion?: string, sucursalId?: number) {
    const envio = await envioRepository.update(id, { estado, sucursalId });

    if (ubicacion) {
      await seguimientoRepository.create({
        envioId: id,
        ubicacion,
        descripcion: `Estado actualizado a: ${estado}`,
        estado: this.mapEnvioStatusToSeguimiento(estado),
        sucursalId,
      });
    }

    return envio;
  }

  private mapEnvioStatusToSeguimiento(status: EstadoEnvio): EstadoSeguimiento {
    const mapping: Record<EstadoEnvio, EstadoSeguimiento> = {
      PENDIENTE: EstadoSeguimiento.ORDEN_CREADA,
      RECOGIDO: EstadoSeguimiento.RECOGIDO,
      EN_TRANSITO: EstadoSeguimiento.EN_TRANSITO,
      EN_SUCURSAL: EstadoSeguimiento.LLEGO_SUCURSAL,
      EN_ENTREGA: EstadoSeguimiento.EN_ENTREGA,
      ENTREGADO: EstadoSeguimiento.ENTREGADO,
      CANCELADO: EstadoSeguimiento.CANCELADO,
    };
    return mapping[status];
  }

  async count(): Promise<number> {
    return envioRepository.count();
  }

  async countByStatus(status: EstadoEnvio): Promise<number> {
    return envioRepository.countByStatus(status);
  }
}
