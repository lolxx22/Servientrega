import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors';
import { ApiResponse } from '../../../shared/types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.constructor.name,
        message: err.message,
      },
    };
    return res.status(err.statusCode).json(response);
  }

  console.error('Unexpected error:', err);

  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor',
    },
  };

  return res.status(500).json(response);
};
