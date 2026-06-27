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
      envioRepository.countByStatus('PENDIENTE' as EstadoEnvio),
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
      envioRepository.countByStatus('PENDIENTE' as EstadoEnvio),
      envioRepository.countByStatus('EN_TRANSITO' as EstadoEnvio),
      envioRepository.countByStatus('ENTREGADO' as EstadoEnvio),
      envioRepository.countByStatus('CANCELADO' as EstadoEnvio),
    ]);

    return {
      shipmentsByStatus: [
        { name: 'Pendiente', value: shipmentsByStatus[0], color: '#F59E0B' },
        { name: 'En Transito', value: shipmentsByStatus[1], color: '#3B82F6' },
        { name: 'Entregado', value: shipmentsByStatus[2], color: '#10B981' },
        { name: 'Cancelado', value: shipmentsByStatus[3], color: '#EF4444' },
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
