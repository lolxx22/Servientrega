import { create } from 'zustand';
import { shipmentService } from '../services/shipment.service';
import type { Shipment, CreateShipmentInput, EstadoEnvio } from '../types';

interface ShipmentState {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  statusFilter: string;
  isLoading: boolean;
  error: string | null;
  load: (page?: number, status?: string) => Promise<void>;
  create: (data: CreateShipmentInput) => Promise<Shipment>;
  updateStatus: (id: number, estado: EstadoEnvio, ubicacion: string) => Promise<void>;
  setPage: (page: number) => void;
  setStatusFilter: (status: string) => void;
}

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  shipments: [],
  total: 0,
  page: 1,
  limit: 12,
  statusFilter: '',
  isLoading: false,
  error: null,

  load: async (page?: number, status?: string) => {
    const p = page ?? get().page;
    const s = status ?? get().statusFilter;
    set({ isLoading: true, error: null });
    try {
      const { shipments, total } = await shipmentService.findAll(p, get().limit, s || undefined);
      set({ shipments, total, page: p, statusFilter: s, isLoading: false });
    } catch {
      set({ error: 'Error al cargar envíos', isLoading: false });
    }
  },

  create: async (data) => {
    const shipment = await shipmentService.create(data);
    await get().load(1, get().statusFilter);
    return shipment;
  },

  updateStatus: async (id, estado, ubicacion) => {
    await shipmentService.updateStatus(id, estado, ubicacion);
    set(s => ({
      shipments: s.shipments.map(sh => sh.id === id ? { ...sh, estado } : sh),
    }));
  },

  setPage: (page) => { get().load(page); },
  setStatusFilter: (status) => { get().load(1, status); },
}));
