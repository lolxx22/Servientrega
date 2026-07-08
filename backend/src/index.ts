import app from './infrastructure/http/express/app';
import { env } from './config/env';
import { prisma } from './config/database';

// ID único de esta instancia del servidor (cambia al reiniciar)
export const INSTANCE_ID = Date.now().toString();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida');

    const PORT = parseInt(env.PORT);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor Servibot AI ejecutándose en puerto ${PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔑 Instance ID: ${INSTANCE_ID}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ El puerto ${PORT} ya está en uso.`);
        console.error(`   Cierra el proceso que lo usa o cambia el puerto en .env (PORT=3001)\n`);
        process.exit(1);
      }
      throw err;
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
