import { EnvioRepository } from '../../infrastructure/database/repositories/shipment.repository';
import { SeguimientoRepository } from '../../infrastructure/database/repositories/tracking.repository';
import { CreateEnvioDTO, EnvioResponse, TrackingInfo } from '../dto/shipment.dto';
import { generateTrackingNumber } from '../../shared/utils/trackingNumber';
import { NotFoundError } from '../../domain/errors';
import { EstadoEnvio, EstadoSeguimiento } from '@prisma/client';
import { getAgencyAddress } from '../../shared/data/agencies';

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
      descripcion: 'Guía creada. Envío generado.',
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
    const envio = await envioRepository.findById(id);
    if (!envio) {
      throw new NotFoundError('Envío no encontrado');
    }

    let ubicacionFinal = ubicacion;

    if (estado === 'RECIBIDO_AGENCIA' && !ubicacion) {
      ubicacionFinal = getAgencyAddress(envio.destino);
    }

    if (estado === 'ENTREGADO' && !ubicacion) {
      ubicacionFinal = envio.destinatarioDireccion || 'Entregado en destino';
    }

    if (estado === 'EN_DISTRIBUCION' && !ubicacion) {
      ubicacionFinal = `En distribución - ${envio.destino}`;
    }

    const updatedEnvio = await envioRepository.update(id, { estado, sucursalId });

    await seguimientoRepository.create({
      envioId: id,
      ubicacion: ubicacionFinal || 'Sin ubicación',
      descripcion: this.getEstadoDescripcion(estado),
      estado: this.mapEnvioStatusToSeguimiento(estado),
      sucursalId,
    });

    return updatedEnvio;
  }

  private getEstadoDescripcion(estado: EstadoEnvio): string {
    const descripciones: Record<EstadoEnvio, string> = {
      GENERADO: 'Envío generado. Guía creada.',
      RECIBIDO_AGENCIA: 'Recibido en agencia. Envío listo para despacho.',
      EN_TRANSITO: 'En tránsito. Envío en ruta hacia destino.',
      EN_DISTRIBUCION: 'En distribución. Envío en reparto.',
      ENTREGADO: 'Entregado. Envío entregado al destinatario.',
      CANCELADO: 'Envío cancelado.',
    };
    return descripciones[estado] || `Estado actualizado a: ${estado}`;
  }

  private mapEnvioStatusToSeguimiento(status: EstadoEnvio): EstadoSeguimiento {
    const mapping: Record<EstadoEnvio, EstadoSeguimiento> = {
      GENERADO: EstadoSeguimiento.ORDEN_CREADA,
      RECIBIDO_AGENCIA: EstadoSeguimiento.RECIBIDO_AGENCIA,
      EN_TRANSITO: EstadoSeguimiento.EN_TRANSITO,
      EN_DISTRIBUCION: EstadoSeguimiento.EN_DISTRIBUCION,
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
