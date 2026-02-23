import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://gabygas.com';
export const SITE_NAME = 'GabyGas';

export const LOCAL_KEYWORDS = [
  'instalación de gas en Medellín',
  'mantenimiento de gas en Bello',
  'técnico gas Envigado',
  'revisión de gas en Itagüí',
  'servicio de gas en Sabaneta',
  'urgencias de gas en Valle de Aburrá',
  'certificación de red de gas en Medellín',
  'instalador de gas certificado en Antioquia',
];

export const MUNICIPALITY_KEYWORDS: Record<string, string[]> = {
  medellin: ['instalación de gas en Medellín', 'mantenimiento de gas en Medellín', 'técnico gas Medellín'],
  bello: ['mantenimiento de gas en Bello', 'revisión técnica de gas Bello', 'técnico de gas a domicilio en Bello'],
  envigado: ['técnico gas Envigado', 'instalación de calentador en Envigado', 'mantenimiento de gas residencial Envigado'],
};

export type MunicipalityPage = {
  slug: 'medellin' | 'bello' | 'envigado';
  city: string;
  headline: string;
  intro: string;
  neighborhoods: string[];
  emergencies: string;
  preventive: string;
  installation: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const MUNICIPALITY_PAGES: MunicipalityPage[] = [
  {
    slug: 'medellin',
    city: 'Medellín',
    headline: 'Instalación y mantenimiento de gas en Medellín con atención prioritaria',
    intro:
      'Atendemos hogares, restaurantes y edificios en Medellín con técnicos certificados para instalaciones nuevas, correcciones de fuga y mantenimiento preventivo con reporte técnico.',
    neighborhoods: ['El Poblado', 'Laureles', 'Belén', 'Robledo', 'Castilla', 'Buenos Aires'],
    emergencies:
      'Cobertura de urgencias en menos de 2 horas en zonas urbanas de Medellín para fugas, olor a gas, fallos de presión y bloqueo de servicio.',
    preventive:
      'Programas trimestrales y semestrales para propiedad horizontal y comercios, con checklists de seguridad y recomendaciones de cumplimiento.',
    installation:
      'Diseño e instalación de redes internas, adecuación de puntos para estufa/calefón y acompañamiento en inspección de habilitación.',
    faqs: [
      {
        question: '¿Cuánto tarda una instalación de gas residencial en Medellín?',
        answer: 'Entre 1 y 3 días hábiles según longitud de la red, número de puntos y validación final de hermeticidad.',
      },
      {
        question: '¿Pueden atender una fuga el mismo día?',
        answer: 'Sí. Priorizamos emergencias en Medellín y coordinamos visita técnica inmediata según la zona y disponibilidad.',
      },
    ],
  },
  {
    slug: 'bello',
    city: 'Bello',
    headline: 'Mantenimiento de gas en Bello para hogares y comercio local',
    intro:
      'Nuestro equipo técnico en Bello realiza diagnósticos de red, mantenimiento anual y correcciones puntuales para mejorar la seguridad y continuidad del suministro de gas.',
    neighborhoods: ['Niquía', 'Cabañas', 'París', 'Santa Ana', 'La Madera'],
    emergencies:
      'Atención de emergencias por olor a gas, fugas en conexiones flexibles y fallas de combustión en calentadores o estufas.',
    preventive:
      'Mantenimiento preventivo para minimizar riesgos, reducir consumo y mejorar el desempeño de equipos a gas en Bello.',
    installation:
      'Instalación de puntos adicionales de gas para cocinas, secadoras y calentadores con pruebas documentadas.',
    faqs: [
      {
        question: '¿Incluyen certificación técnica después del mantenimiento?',
        answer: 'Entregamos reporte técnico de intervención y recomendaciones para facilitar auditorías o revisiones posteriores.',
      },
      {
        question: '¿Atienden unidades residenciales en Bello?',
        answer: 'Sí, coordinamos mantenimiento por etapas para no afectar la operación de la copropiedad.',
      },
    ],
  },
  {
    slug: 'envigado',
    city: 'Envigado',
    headline: 'Técnico de gas en Envigado para revisión, instalación y emergencias',
    intro:
      'En Envigado atendemos viviendas y negocios con soporte técnico especializado para redes internas, ajustes de presión y control de fugas.',
    neighborhoods: ['El Dorado', 'Zúñiga', 'La Magnolia', 'San Marcos', 'Las Antillas'],
    emergencies:
      'Respuesta técnica para eventos críticos de fuga o fallas de combustión, con protocolo de seguridad y reparación segura.',
    preventive:
      'Planes de mantenimiento semestral para equipos de alta demanda, especialmente en restaurantes y locales comerciales.',
    installation:
      'Montaje de redes internas con materiales certificados y configuración segura para estufa, horno y calentador.',
    faqs: [
      {
        question: '¿Cómo sé si necesito mantenimiento de gas?',
        answer: 'Si notas olor, cambios de llama, baja presión o ruidos inusuales, se recomienda revisión inmediata.',
      },
      {
        question: '¿Trabajan con agenda programada en Envigado?',
        answer: 'Sí, puedes reservar visita por franja horaria para mantenimiento o instalación de nuevos puntos.',
      },
    ],
  },
];

export function buildCanonical(pathname: string) {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonical = buildCanonical(path);
  return {
    title,
    description,
    keywords: [...LOCAL_KEYWORDS, ...keywords],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
