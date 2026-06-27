export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'OPERATOR';
  createdAt: string;
}

export interface Shipment {
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
  estado: 'PENDIENTE' | 'EN_TRANSITO' | 'ENTREGADO' | 'CANCELADO';
  sucursalId: number | null;
  fechaCreacion: string;
  fechaEntrega: string | null;
}

export interface TrackingInfo {
  numeroGuia: string;
  estado: string;
  ubicacion: string;
  descripcion: string;
  fechaUltimaActualizacion: string;
  fechaEstimadaEntrega: string | null;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  totalBranches: number;
  totalClients?: number;
  totalConversations?: number;
}

export interface ChartData {
  shipmentsByStatus: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  shipmentsByCity: Array<{
    city: string;
    count: number;
  }>;
  monthlyActivity: Array<{
    month: string;
    envios: number;
    entregas: number;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
