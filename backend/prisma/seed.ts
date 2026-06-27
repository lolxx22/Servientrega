import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // ============================================
  // SUCURSALES
  // ============================================
  console.log('📍 Creando sucursales...');

  const sucursales = [
    { nombre: 'Centro Logistico Quito', codigo: 'UIO', ciudad: 'Quito', direccion: 'Av. Amazonas N36-50', telefono: '02-234-5678' },
    { nombre: 'Sucursal Quito Norte', codigo: 'UIO-N', ciudad: 'Quito', direccion: 'Av. De los Shyris N34-40', telefono: '02-234-5679' },
    { nombre: 'Sucursal Quito Sur', codigo: 'UIO-S', ciudad: 'Quito', direccion: 'Av. Maldonado y Naciones Unidas', telefono: '02-234-5680' },
    { nombre: 'Centro Logistico Guayaquil', codigo: 'GYE', ciudad: 'Guayaquil', direccion: 'Av. Francisco de Orellana', telefono: '04-234-5678' },
    { nombre: 'Sucursal Guayaquil Norte', codigo: 'GYE-N', ciudad: 'Guayaquil', direccion: 'Av. 9 de Octubre', telefono: '04-234-5679' },
    { nombre: 'Sucursal Guayaquil Sur', codigo: 'GYE-S', ciudad: 'Guayaquil', direccion: 'Av. Carlos Espinoza', telefono: '04-234-5680' },
    { nombre: 'Sucursal Cuenca', codigo: 'CUE', ciudad: 'Cuenca', direccion: 'Av. Solano', telefono: '07-234-5678' },
    { nombre: 'Sucursal Ambato', codigo: 'AMB', ciudad: 'Ambato', direccion: 'Av. Cevallos', telefono: '03-234-5678' },
    { nombre: 'Sucursal Manta', codigo: 'MNT', ciudad: 'Manta', direccion: 'Av. 4 de Noviembre', telefono: '05-234-5678' },
    { nombre: 'Sucursal Loja', codigo: 'LJ', ciudad: 'Loja', direccion: 'Av. Juan de Salinas', telefono: '07-234-5679' },
    { nombre: 'Sucursal Latacunga', codigo: 'LAT', ciudad: 'Latacunga', direccion: 'Av. Quito', telefono: '03-234-5680' },
    { nombre: 'Sucursal Riobamba', codigo: 'RIO', ciudad: 'Riobamba', direccion: 'Av. Daniel Leon Borja', telefono: '03-234-5681' },
  ];

  for (const sucursal of sucursales) {
    await prisma.sucursal.upsert({
      where: { codigo: sucursal.codigo },
      update: {},
      create: sucursal,
    });
  }
  console.log(`   ✅ ${sucursales.length} sucursales creadas`);

  // ============================================
  // TARIFAS DE ENVIO
  // ============================================
  console.log('💰 Creando tarifas de envio...');

  const tarifas = [
    // Desde Quito
    { ciudadOrigen: 'Quito', ciudadDestino: 'Guayaquil', tarifaDocumento: 2.50, tarifaKg: 1.80, tarifaMinima: 5.00 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Cuenca', tarifaDocumento: 3.00, tarifaKg: 2.20, tarifaMinima: 6.00 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Ambato', tarifaDocumento: 2.00, tarifaKg: 1.50, tarifaMinima: 4.00 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Manta', tarifaDocumento: 2.80, tarifaKg: 2.00, tarifaMinima: 5.50 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Loja', tarifaDocumento: 3.50, tarifaKg: 2.50, tarifaMinima: 7.00 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Latacunga', tarifaDocumento: 1.50, tarifaKg: 1.20, tarifaMinima: 3.50 },
    { ciudadOrigen: 'Quito', ciudadDestino: 'Riobamba', tarifaDocumento: 2.20, tarifaKg: 1.60, tarifaMinima: 4.50 },

    // Desde Guayaquil
    { ciudadOrigen: 'Guayaquil', ciudadDestino: 'Quito', tarifaDocumento: 2.50, tarifaKg: 1.80, tarifaMinima: 5.00 },
    { ciudadOrigen: 'Guayaquil', ciudadDestino: 'Cuenca', tarifaDocumento: 2.80, tarifaKg: 2.00, tarifaMinima: 5.50 },
    { ciudadOrigen: 'Guayaquil', ciudadDestino: 'Manta', tarifaDocumento: 2.00, tarifaKg: 1.60, tarifaMinima: 4.50 },
    { ciudadOrigen: 'Guayaquil', ciudadDestino: 'Ambato', tarifaDocumento: 2.50, tarifaKg: 1.80, tarifaMinima: 5.00 },
    { ciudadOrigen: 'Guayaquil', ciudadDestino: 'Loja', tarifaDocumento: 3.20, tarifaKg: 2.30, tarifaMinima: 6.50 },

    // Desde Cuenca
    { ciudadOrigen: 'Cuenca', ciudadDestino: 'Quito', tarifaDocumento: 3.00, tarifaKg: 2.20, tarifaMinima: 6.00 },
    { ciudadOrigen: 'Cuenca', ciudadDestino: 'Guayaquil', tarifaDocumento: 2.80, tarifaKg: 2.00, tarifaMinima: 5.50 },
    { ciudadOrigen: 'Cuenca', ciudadDestino: 'Loja', tarifaDocumento: 2.50, tarifaKg: 1.90, tarifaMinima: 5.00 },
    { ciudadOrigen: 'Cuenca', ciudadDestino: 'Ambato', tarifaDocumento: 2.30, tarifaKg: 1.70, tarifaMinima: 4.80 },

    // Desde Ambato
    { ciudadOrigen: 'Ambato', ciudadDestino: 'Quito', tarifaDocumento: 2.00, tarifaKg: 1.50, tarifaMinima: 4.00 },
    { ciudadOrigen: 'Ambato', ciudadDestino: 'Guayaquil', tarifaDocumento: 2.50, tarifaKg: 1.80, tarifaMinima: 5.00 },
    { ciudadOrigen: 'Ambato', ciudadDestino: 'Cuenca', tarifaDocumento: 2.30, tarifaKg: 1.70, tarifaMinima: 4.80 },

    // Desde Manta
    { ciudadOrigen: 'Manta', ciudadDestino: 'Quito', tarifaDocumento: 2.80, tarifaKg: 2.00, tarifaMinima: 5.50 },
    { ciudadOrigen: 'Manta', ciudadDestino: 'Guayaquil', tarifaDocumento: 2.00, tarifaKg: 1.60, tarifaMinima: 4.50 },

    // Desde Loja
    { ciudadOrigen: 'Loja', ciudadDestino: 'Quito', tarifaDocumento: 3.50, tarifaKg: 2.50, tarifaMinima: 7.00 },
    { ciudadOrigen: 'Loja', ciudadDestino: 'Guayaquil', tarifaDocumento: 3.20, tarifaKg: 2.30, tarifaMinima: 6.50 },
    { ciudadOrigen: 'Loja', ciudadDestino: 'Cuenca', tarifaDocumento: 2.50, tarifaKg: 1.90, tarifaMinima: 5.00 },
  ];

  for (const tarifa of tarifas) {
    await prisma.tarifaEnvio.upsert({
      where: {
        ciudadOrigen_ciudadDestino: {
          ciudadOrigen: tarifa.ciudadOrigen,
          ciudadDestino: tarifa.ciudadDestino,
        },
      },
      update: {},
      create: tarifa,
    });
  }
  console.log(`   ✅ ${tarifas.length} tarifas creadas`);

  // ============================================
  // USUARIO ADMIN POR DEFECTO
  // ============================================
  console.log('👤 Creando usuario admin...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@servientrega.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@servientrega.com',
      password: adminPassword,
      rol: 'ADMIN',
    },
  });
  console.log('   ✅ Usuario admin creado (admin@servientrega.com / admin123)');

  console.log('\n✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
