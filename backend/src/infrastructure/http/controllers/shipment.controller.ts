import { Request, Response } from 'express';
import { EnvioService } from '../../../application/services/shipment.service';
import { ApiResponse } from '../../../shared/types';
import { EstadoEnvio } from '@prisma/client';

const envioService = new EnvioService();

export class EnvioController {
  async create(req: Request, res: Response) {
    const envio = await envioService.createDirect(req.body);
    const response: ApiResponse = {
      success: true,
      data: envio,
      message: 'Envio creado exitosamente',
    };
    res.status(201).json(response);
  }

  async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as EstadoEnvio | undefined;
    const result = await envioService.findAll(page, limit, status);
    const response: ApiResponse = {
      success: true,
      data: result.envios,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
    res.status(200).json(response);
  }

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const envio = await envioService.findById(id);
    const response: ApiResponse = {
      success: true,
      data: envio,
    };
    res.status(200).json(response);
  }

  async findByTrackingNumber(req: Request, res: Response) {
    const guia = req.params.guia as string;
    const trackingInfo = await envioService.findByTrackingNumber(guia);
    const response: ApiResponse = {
      success: true,
      data: trackingInfo,
    };
    res.status(200).json(response);
  }

  async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { estado, ubicacion } = req.body;
    const envio = await envioService.updateStatus(id, estado, ubicacion);
    const response: ApiResponse = {
      success: true,
      data: envio,
      message: 'Estado actualizado exitosamente',
    };
    res.status(200).json(response);
  }
}
