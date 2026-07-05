export const AGENCIES: Record<string, { address: string; phone: string }> = {
  'Guayaquil': {
    address: 'Av. Juan Tanca Marengo y Dr. Camilo Ponce Enrique, Guayaquil',
    phone: '(04) 373 2000',
  },
  'Quito': {
    address: 'Galo Plaza Lasso E1-75 y los Cedros, Quito',
    phone: '(02) 373 2000',
  },
  'Cuenca': {
    address: 'Panamericana Norte S/N Km 14 Sector Challuabamba, Cuenca',
    phone: '(07) 373 2000',
  },
  'Ambato': {
    address: 'Av. Cevallos y Montalvo, Ambato',
    phone: '(03) 373 2000',
  },
  'Riobamba': {
    address: 'Av. Daniel León Borja y Mera, Riobamba',
    phone: '(03) 373 2000',
  },
  'Loja': {
    address: 'Av. Universitaria y Juan de Salinas, Loja',
    phone: '(07) 373 2000',
  },
  'Manta': {
    address: 'Av. 4 de Noviembre y De Los Manta, Manta',
    phone: '(05) 373 2000',
  },
  'Esmeraldas': {
    address: 'Calle Bolívar entre Víctor Manuel Rendón y Ricaurte, Esmeraldas',
    phone: '(06) 373 2000',
  },
  'Ibarra': {
    address: 'Av. 10 de Agosto y Sucre, Ibarra',
    phone: '(06) 373 2000',
  },
  'Santo Domingo': {
    address: 'Av. Quito y Calle 23 de Enero, Santo Domingo',
    phone: '(02) 373 2000',
  },
  'Milagro': {
    address: 'Av. 25 de Junio y Calle 10 de Agosto, Milagro',
    phone: '(04) 373 2000',
  },
  'Portoviejo': {
    address: 'Av. Bolivariana y 10 de Agosto, Portoviejo',
    phone: '(05) 373 2000',
  },
  'Quevedo': {
    address: 'Av. Quito y Calle Kennedy, Quevedo',
    phone: '(05) 373 2000',
  },
  'Latacunga': {
    address: 'Av. Cevallos y Belisario Quevedo, Latacunga',
    phone: '(03) 373 2000',
  },
  'Babahoyo': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Babahoyo',
    phone: '(05) 373 2000',
  },
  'Tulcán': {
    address: 'Av. 10 de Agosto y Sucre, Tulcán',
    phone: '(06) 373 2000',
  },
  'Salinas': {
    address: 'Av. José de Villamil y Calle 25 de Julio, Salinas',
    phone: '(04) 373 2000',
  },
  'La Libertad': {
    address: 'Av. Principal y Calle 10 de Agosto, La Libertad',
    phone: '(04) 373 2000',
  },
  'Guaranda': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Guaranda',
    phone: '(03) 373 2000',
  },
  'Azogues': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Azogues',
    phone: '(07) 373 2000',
  },
  'Macas': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Macas',
    phone: '(07) 373 2000',
  },
  'Puyo': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Puyo',
    phone: '(03) 373 2000',
  },
  'Tena': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Tena',
    phone: '(06) 373 2000',
  },
  'Coca': {
    address: 'Av. 10 de Agosto y Calle Bolívar, Coca',
    phone: '(06) 373 2000',
  },
};

export function getAgencyAddress(city: string): string {
  const agency = AGENCIES[city];
  if (agency) {
    return `Servientrega ${city} - ${agency.address}`;
  }
  return `Centro de Soluciones ${city}`;
}

export function getAgencyPhone(city: string): string {
  const agency = AGENCIES[city];
  return agency?.phone || '';
}
