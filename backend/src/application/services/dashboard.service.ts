import { UsuarioRepository } from '../../infrastructure/database/repositories/user.repository';
import { EnvioRepository } from '../../infrastructure/database/repositories/shipment.repository';
import { SucursalRepository } from '../../infrastructure/database/repositories/branch.repository';
import { EstadoEnvio } from '@prisma/client';

const usuarioRepository = new UsuarioRepository();
const envioRepository = new EnvioRepository();
const sucursalRepository = new SucursalRepository();

export class DashboardService {
  async getMetrics() {
    const [
      totalUsers,
      totalShipments,
      activeShipments,
      deliveredShipments,
      pendingShipments,
      totalBranches,
    ] = await Promise.all([
      usuarioRepository.count(),
      envioRepository.count(),
      envioRepository.countByStatus('EN_TRANSITO' as EstadoEnvio),
      envioRepository.countByStatus('ENTREGADO' as EstadoEnvio),
      envioRepository.countByStatus('GENERADO' as EstadoEnvio),
      sucursalRepository.count(),
    ]);

    return {
      totalUsers,
      totalShipments,
      activeShipments,
      deliveredShipments,
      pendingShipments,
      totalBranches,
    };
  }

  async getChartData() {
    const shipmentsByStatus = await Promise.all([
      envioRepository.countByStatus('GENERADO' as EstadoEnvio),
      envioRepository.countByStatus('RECIBIDO_AGENCIA' as EstadoEnvio),
      envioRepository.countByStatus('EN_TRANSITO' as EstadoEnvio),
      envioRepository.countByStatus('EN_DISTRIBUCION' as EstadoEnvio),
      envioRepository.countByStatus('ENTREGADO' as EstadoEnvio),
      envioRepository.countByStatus('CANCELADO' as EstadoEnvio),
    ]);

    return {
      shipmentsByStatus: [
        { name: 'Generado', value: shipmentsByStatus[0], color: '#F59E0B' },
        { name: 'Recibido Agencia', value: shipmentsByStatus[1], color: '#3B82F6' },
        { name: 'En Tránsito', value: shipmentsByStatus[2], color: '#8B5CF6' },
        { name: 'En Distribución', value: shipmentsByStatus[3], color: '#06B6D4' },
        { name: 'Entregado', value: shipmentsByStatus[4], color: '#10B981' },
        { name: 'Cancelado', value: shipmentsByStatus[5], color: '#EF4444' },
      ],
      shipmentsByCity: [
        { city: 'Quito', count: 45 },
        { city: 'Guayaquil', count: 38 },
        { city: 'Cuenca', count: 22 },
        { city: 'Ambato', count: 15 },
        { city: 'Riobamba', count: 12 },
      ],
      monthlyActivity: [
        { month: 'Ene', envios: 120, entregas: 100 },
        { month: 'Feb', envios: 135, entregas: 125 },
        { month: 'Mar', envios: 150, entregas: 140 },
        { month: 'Abr', envios: 145, entregas: 138 },
        { month: 'May', envios: 160, entregas: 152 },
        { month: 'Jun', envios: 175, entregas: 165 },
      ],
    };
  }
}
