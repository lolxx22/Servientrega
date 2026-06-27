import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../../shared/utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../../../domain/errors';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    rol: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de acceso requerido'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return next(new UnauthorizedError('Token invalido o expirado'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('No autenticado'));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new ForbiddenError('No tienes permiso para realizar esta accion'));
    }

    next();
  };
};
