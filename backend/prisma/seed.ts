import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ============================================
// DATOS DE CIUDADES CON COORDENADAS
// ============================================
type Region = 'sierra' | 'costa' | 'oriente';

interface City {
  codigo: string;
  region: Region;
  lat: number;
  lng: number;
  direccion: string;
  telefono: string;
}

const CIUDADES: Record<string, City> = {
  'Quito':             { codigo: 'UIO', region: 'sierra',   lat: 0.1807, lng: -78.4678, direccion: 'Av. Amazonas N36-50',           telefono: '02-234-5678' },
  'Guayaquil':         { codigo: 'GYE', region: 'costa',   lat: -2.1894, lng: -79.8891, direccion: 'Av. Francisco de Orellana',     telefono: '04-234-5678' },
  'Cuenca':            { codigo: 'CUE', region: 'sierra',   lat: -2.9001, lng: -79.0059, direccion: 'Av. Solano',                   telefono: '07-234-5678' },
  'Ambato':            { codigo: 'AMB', region: 'sierra',   lat: -1.8186, lng: -78.1853, direccion: 'Av. Cevallos',                 telefono: '03-234-5678' },
  'Portoviejo':        { codigo: 'PVO', region: 'costa',   lat: -1.0544, lng: -80.4553, direccion: 'Av. 5 de Octubre',             telefono: '05-234-5680' },
  'Manta':             { codigo: 'MNT', region: 'costa',   lat: -0.9680, lng: -80.7089, direccion: 'Av. 4 de Noviembre',           telefono: '05-234-5678' },
  'Loja':              { codigo: 'LJ',  region: 'sierra',   lat: -3.9931, lng: -79.2042, direccion: 'Av. Juan de Salinas',          telefono: '07-234-5679' },
  'Riobamba':          { codigo: 'RIO', region: 'sierra',   lat: -1.6635, lng: -78.6538, direccion: 'Av. Daniel León Borja',        telefono: '03-234-5681' },
  'Latacunga':         { codigo: 'LAT', region: 'sierra',   lat: -0.9333, lng: -78.6167, direccion: 'Av. Quito',                   telefono: '03-234-5680' },
  'Santo Domingo':     { codigo: 'STO', region: 'costa',   lat: -0.2522, lng: -79.1769, direccion: 'Av. Tsáchilas',               telefono: '02-234-5690' },
  'Esmeraldas':        { codigo: 'ESM', region: 'costa',   lat: 0.9535, lng: -79.6665, direccion: 'Av. Atahualpa',               telefono: '06-234-5678' },
  'Ibarra':            { codigo: 'IBA', region: 'sierra',   lat: 0.3492, lng: -78.1219, direccion: 'Av. Sucre',                   telefono: '06-234-5679' },
  'Santa Elena':       { codigo: 'STE', region: 'costa',   lat: -2.2268, lng: -80.8589, direccion: 'Av. Santander',               telefono: '04-234-5682' },
  'Salinas':           { codigo: 'SAL', region: 'costa',   lat: -2.2164, lng: -80.9613, direccion: 'Av. 25 de Junio',             telefono: '04-234-5683' },
  'Tulcán':            { codigo: 'TUL', region: 'sierra',   lat: 1.0926, lng: -77.7217, direccion: 'Av. Sucre',                   telefono: '06-234-5680' },
  'Milagro':           { codigo: 'MIL', region: 'costa',   lat: -2.1343, lng: -79.5941, direccion: 'Av. 10 de Agosto',            telefono: '04-234-5684' },
  'Babahoyo':          { codigo: 'BAB', region: 'costa',   lat: -1.8023, lng: -79.5360, direccion: 'Av. Bolívar',                 telefono: '05-234-5681' },
  'Guaranda':          { codigo: 'GUA', region: 'sierra',   lat: -1.5926, lng: -78.9993, direccion: 'Av. 10 de Agosto',            telefono: '03-234-5682' },
  'Azogues':           { codigo: 'AZO', region: 'sierra',   lat: -2.8833, lng: -78.8333, direccion: 'Av. Cevallos',                telefono: '07-234-5680' },
  'Macas':             { codigo: 'MAC', region: 'oriente',  lat: -2.3098, lng: -78.1834, direccion: 'Av. Amazonas',                telefono: '07-234-5681' },
  'Puyo':              { codigo: 'PUY', region: 'oriente',  lat: -1.4900, lng: -78.0000, direccion: 'Av. Amazonas',                telefono: '03-234-5683' },
  'Tena':              { codigo: 'TNA', region: 'oriente',  lat: -0.9980, lng: -77.8120, direccion: 'Av. 15 de Noviembre',         telefono: '06-234-5681' },
  'Lago Agrio':        { codigo: 'LAG', region: 'oriente',  lat: 0.0864, lng: -76.8983, direccion: 'Av. Quito',                   telefono: '06-234-5682' },
  'Coca':              { codigo: 'COC', region: 'oriente',  lat: -0.4600, lng: -76.9900, direccion: 'Av. Amazonas',                telefono: '06-234-5683' },
};

const CIUDADES_LIST = Object.keys(CIUDADES);

// ============================================
// CÁLCULO DE DISTANCIA Y TARIFAS
// ============================================
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcTarifa(origen: string, destino: string) {
  const o = CIUDADES[origen];
  const d = CIUDADES[destino];
  const dist = haversine(o.lat, o.lng, d.lat, d.lng);

  // Tarifa base por distancia
  let doc: number, kg: number, min: number;

  if (dist < 60) {
    doc = 1.30; kg = 1.00; min = 3.00;
  } else if (dist < 120) {
    doc = 1.70; kg = 1.30; min = 4.00;
  } else if (dist < 200) {
    doc = 2.10; kg = 1.60; min = 4.80;
  } else if (dist < 300) {
    doc = 2.60; kg = 1.90; min = 5.50;
  } else if (dist < 400) {
    doc = 3.10; kg = 2.30; min = 6.50;
  } else if (dist < 500) {
    doc = 3.60; kg = 2.70; min = 7.50;
  } else {
    doc = 4.20; kg = 3.20; min = 9.00;
  }

  // Recargo por cruzar regiones
  if (o.region !== d.region) {
    if (
      (o.region === 'sierra' && d.region === 'costa') ||
      (o.region === 'costa' && d.region === 'sierra')
    ) {
      doc += 0.40; kg += 0.30; min += 1.00;
    } else if (
      (o.region === 'sierra' && d.region === 'oriente') ||
      (o.region === 'oriente' && d.region === 'sierra')
    ) {
      doc += 1.00; kg += 0.80; min += 2.50;
    } else if (
      (o.region === 'costa' && d.region === 'oriente') ||
      (o.region === 'oriente' && d.region === 'costa')
    ) {
      doc += 1.50; kg += 1.20; min += 3.50;
    }
  }

  return {
    tarifaDocumento: Math.round(doc * 100) / 100,
    tarifaKg: Math.round(kg * 100) / 100,
    tarifaMinima: Math.round(min * 100) / 100,
  };
}

// ============================================
// SEED PRINCIPAL
// ============================================
async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ── SUCURSALES ──
  console.log('📍 Creando sucursales...');

  for (const [ciudad, data] of Object.entries(CIUDADES)) {
    await prisma.sucursal.upsert({
      where: { codigo: data.codigo },
      update: {},
      create: {
        nombre: `Sucursal ${ciudad}`,
        codigo: data.codigo,
        ciudad,
        direccion: data.direccion,
        telefono: data.telefono,
      },
    });
  }
  console.log(`   ✅ ${CIUDADES_LIST.length} sucursales creadas\n`);

  // ── TARIFAS DE ENVIO ──
  console.log('💰 Creando tarifas de envío...');

  let tarifasCreadas = 0;

  for (const origen of CIUDADES_LIST) {
    for (const destino of CIUDADES_LIST) {
      if (origen === destino) continue;

      const tarifa = calcTarifa(origen, destino);

      await prisma.tarifaEnvio.upsert({
        where: {
          ciudadOrigen_ciudadDestino: {
            ciudadOrigen: origen,
            ciudadDestino: destino,
          },
        },
        update: {},
        create: {
          ciudadOrigen: origen,
          ciudadDestino: destino,
          ...tarifa,
        },
      });

      tarifasCreadas++;
    }
  }
  console.log(`   ✅ ${tarifasCreadas} tarifas creadas\n`);

  // ── USUARIO ADMIN ──
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
  console.log('   ✅ Usuario admin creado (admin@servientrega.com / admin123)\n');

  console.log('✅ Seed completado exitosamente!');
  console.log(`   📊 Resumen: ${CIUDADES_LIST.length} ciudades, ${tarifasCreadas} rutas`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
