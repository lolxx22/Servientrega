import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import routes from '../routes';
import swaggerRoutes from '../routes/swagger.routes';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import { env } from '../../../config/env';
import swaggerSpec from '../../../config/swagger';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: env.APP_URL,
  credentials: true,
}));

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones, por favor intente más tarde',
});
app.use('/api/', generalLimiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Demasiados intentos de autenticación, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Servibot AI - API Docs',
}));

// API routes
app.use('/api', swaggerRoutes);
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
