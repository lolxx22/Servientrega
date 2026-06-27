import { Request, Response } from 'express';
import { UserService } from '../../../application/services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../../../shared/types';

const userService = new UserService();

export class UserController {
  async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await userService.findAll(page, limit);
    const response: ApiResponse = {
      success: true,
      data: result.usuarios,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
    res.status(200).json(response);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userService.update(id, req.body);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'Usuario actualizado exitosamente',
    };
    res.status(200).json(response);
  }

  async changeRol(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userService.changeRol(id, req.body);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'Rol actualizado exitosamente',
    };
    res.status(200).json(response);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await userService.delete(id);
    const response: ApiResponse = {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };
    res.status(200).json(response);
  }
}
