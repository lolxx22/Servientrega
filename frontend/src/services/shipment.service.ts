import api from './api';
import type { ApiResponse, Shipment, TrackingInfo } from '../types';

export const shipmentService = {
  async findAll(page = 1, limit = 10, status?: string): Promise<{ shipments: Shipment[]; total: number }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    const { data } = await api.get<ApiResponse<Shipment[]>>(`/shipments?${params}`);
    return { shipments: data.data || [], total: data.pagination?.total || 0 };
  },

  async findById(id: number): Promise<Shipment> {
    const { data } = await api.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return data.data!;
  },

  async trackByNumber(guia: string): Promise<TrackingInfo> {
    const { data } = await api.get<ApiResponse<TrackingInfo>>(`/shipments/tracking/${guia}`);
    return data.data!;
  },

  async create(shipmentData: {
    origen: string;
    destino: string;
    peso: number;
    remitenteNombre: string;
    remitenteTelefono: string;
    remitenteDireccion: string;
    destinatarioNombre: string;
    destinatarioTelefono: string;
    destinatarioDireccion: string;
    tipoProducto?: string;
  }): Promise<Shipment> {
    const { data } = await api.post<ApiResponse<Shipment>>('/shipments', shipmentData);
    return data.data!;
  },
};
