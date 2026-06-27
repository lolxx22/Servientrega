import { Router, Request, Response } from 'express';
import { generateToken } from '../../../shared/utils/jwt';
import { UsuarioRepository } from '../../database/repositories/user.repository';
import { comparePassword } from '../../../shared/utils/bcrypt';

const router = Router();
const usuarioRepository = new UsuarioRepository();

router.post('/swagger-login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Email y contrasena son requeridos',
      },
    });
    return;
  }

  try {
    const user = await usuarioRepository.findByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Credenciales invalidas',
        },
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Credenciales invalidas',
        },
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      rol: user.rol,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      },
      message: 'Token generado exitosamente',
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al generar token',
      },
    });
  }
});

export default router;
