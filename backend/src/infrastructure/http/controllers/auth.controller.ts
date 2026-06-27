import { Request, Response } from 'express';
import { UserService } from '../../../application/services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../../../shared/types';

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    const user = await userService.register(req.body);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'Usuario registrado exitosamente',
    };
    res.status(201).json(response);
  }

  async login(req: Request, res: Response) {
    const result = await userService.login(req.body);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Inicio de sesion exitoso',
    };
    res.status(200).json(response);
  }

  async getProfile(req: AuthRequest, res: Response) {
    const user = await userService.getProfile(req.user!.userId);
    const response: ApiResponse = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  }
}
