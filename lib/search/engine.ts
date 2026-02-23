import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

type SearchKind = 'service' | 'product' | 'faq';

export type UnifiedSearchResult = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  url: string;
  score: number;
};

export type UnifiedSearchResponse = {
  normalizedQuery: string;
  suggestions: string[];
  results: UnifiedSearchResult[];
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  url: string;
  tags: string[];
};

const FAQS: FaqItem[] = [
  {
    id: 'faq-fuga-gas',
    question: '¿Qué debo hacer si detecto una fuga de gas?',
    answer:
      'Cierra la válvula principal, ventila el lugar y solicita una revisión técnica inmediata con personal certificado.',
    url: '/contacto',
    tags: ['fuga', 'escape', 'olor', 'emergencia', 'revision'],
  },
  {
    id: 'faq-mantenimiento',
    question: '¿Cada cuánto se recomienda el mantenimiento del sistema de gas?',
    answer:
      'Se recomienda una revisión preventiva al menos una vez al año o cuando notes olor, baja presión o desgaste de conexiones.',
    url: '/servicios',
    tags: ['mantenimiento', 'revision', 'anual', 'preventivo', 'calentador'],
  },
  {
    id: 'faq-calentador',
    question: '¿También realizan revisión de calentadores?',
    answer:
      'Sí, ofrecemos diagnóstico de calentadores y validación de conexiones para hogares y comercios del Valle de Aburrá.',
    url: '/servicios',
    tags: ['calentador', 'boiler', 'revision', 'mantenimiento'],
  },
];

const SYNONYMS: Record<string, string[]> = {
  gas: ['cilindro', 'glp', 'combustible'],
  calentador: ['boiler', 'calefon', 'calefón'],
  revision: ['revisión', 'diagnostico', 'diagnóstico', 'inspeccion', 'inspección', 'chequeo'],
  mantenimiento: ['preventivo', 'ajuste', 'soporte'],
  fuga: ['escape', 'olor', 'emergencia'],
  domicilio: ['entrega', 'envio', 'envío', 'express'],
  valle: ['aburra', 'aburrá', 'medellin', 'medellín', 'bello', 'envigado', 'itagui', 'itagüí', 'sabaneta'],
};

const COMMERCIAL_TERMS = new Set([
  'comprar',
  'precio',
  'cotizar',
  'domicilio',
  'urgente',
  'instalar',
  'instalacion',
  'instalación',
  'mantenimiento',
  'revision',
  'revisión',
  'fuga',
]);

const TARGET_GEO_TERMS = new Set([
  'valle',
  'aburra',
  'aburrá',
  'medellin',
  'medellín',
  'bello',
  'envigado',
  'itagui',
  'itagüí',
  'sabaneta',
  'estrella',
  'caldas',
  'copacabana',
  'girardota',
  'barbosa',
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));
  for (let i = 0; i <= b.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }

  return matrix[b.length][a.length];
}

function fuzzyContains(needle: string, haystackWords: string[]) {
  if (!needle) return false;
  for (const word of haystackWords) {
    if (word.includes(needle) || needle.includes(word)) return true;
    const distance = levenshtein(needle, word);
    const tolerance = needle.length >= 6 ? 2 : 1;
    if (distance <= tolerance) return true;
  }
  return false;
}

function expandTerms(input: string) {
  const words = normalize(input).split(' ').filter(Boolean);
  const expanded = new Set(words);

  for (const [base, aliases] of Object.entries(SYNONYMS)) {
    const normalizedBase = normalize(base);
    if (words.includes(normalizedBase) || aliases.some((alias) => words.includes(normalize(alias)))) {
      expanded.add(normalizedBase);
      for (const alias of aliases) expanded.add(normalize(alias));
    }
  }

  return Array.from(expanded);
}

function buildScore(terms: string[], content: string, kind: SearchKind) {
  const normalizedContent = normalize(content);
  const words = normalizedContent.split(' ').filter(Boolean);

  let score = 0;
  for (const term of terms) {
    if (normalizedContent.includes(term)) {
      score += 12;
      continue;
    }

    if (fuzzyContains(term, words)) {
      score += 7;
    }
  }

  const hasCommercialIntent = terms.some((term) => COMMERCIAL_TERMS.has(term));
  if (hasCommercialIntent) {
    score += kind === 'product' ? 12 : 8;
  }

  const hasGeoIntent = terms.some((term) => TARGET_GEO_TERMS.has(term));
  if (hasGeoIntent) {
    score += kind === 'service' ? 10 : 4;
  }

  if (kind === 'faq') score += 3;

  return score;
}

export async function runUnifiedSearch(query: string): Promise<UnifiedSearchResponse> {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return {
      normalizedQuery,
      suggestions: ['gas domiciliario en medellín', 'revisión de calentador', 'fuga de gas urgente'],
      results: [],
    };
  }

  const terms = expandTerms(normalizedQuery);

  const [services, products] = await Promise.all([
    prisma.service.findMany({
      select: { id: true, name: true, shortDescription: true, description: true, seoSlug: true },
      take: 50,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true, brand: true, seoSlug: true },
      take: 100,
    }),
  ]);

  const results: UnifiedSearchResult[] = [];

  for (const service of services) {
    const content = `${service.name} ${service.shortDescription ?? ''} ${service.description ?? ''} valle de aburra medellin envigado bello itagui sabaneta`;
    const score = buildScore(terms, content, 'service');
    if (score > 0) {
      results.push({
        id: service.id,
        kind: 'service',
        title: service.name,
        description: service.shortDescription ?? service.description ?? 'Servicio técnico de gas.',
        url: `/servicios#${service.seoSlug}`,
        score,
      });
    }
  }

  for (const product of products) {
    const content = `${product.name} ${product.description ?? ''} ${product.brand ?? ''}`;
    const score = buildScore(terms, content, 'product');
    if (score > 0) {
      results.push({
        id: product.id,
        kind: 'product',
        title: product.name,
        description: product.description ?? `Producto ${product.brand ?? ''}`,
        url: `/tienda/${product.seoSlug}`,
        score,
      });
    }
  }

  for (const faq of FAQS) {
    const content = `${faq.question} ${faq.answer} ${faq.tags.join(' ')}`;
    const score = buildScore(terms, content, 'faq');
    if (score > 0) {
      results.push({
        id: faq.id,
        kind: 'faq',
        title: faq.question,
        description: faq.answer,
        url: faq.url,
        score,
      });
    }
  }

  const sorted = results.sort((a, b) => b.score - a.score).slice(0, 20);

  const suggestions = sorted.slice(0, 5).map((item) => item.title);

  await createAuditLog({
    action: 'search_query',
    entity: 'search',
    entityId: normalizedQuery,
    before: null,
    after: {
      query: normalizedQuery,
      terms,
      resultCount: sorted.length,
      hasResults: sorted.length > 0,
    },
  });

  return {
    normalizedQuery,
    suggestions,
    results: sorted,
  };
}

export async function registerSearchClick(query: string, resultId: string, kind: SearchKind) {
  await createAuditLog({
    action: 'search_click',
    entity: 'search',
    entityId: resultId,
    before: null,
    after: {
      query: normalize(query),
      resultId,
      kind,
      clickedAt: new Date().toISOString(),
    },
  });
}

export function autocompleteSuggestions(rawQuery: string) {
  const query = normalize(rawQuery);
  if (!query) return [];

  const dictionary = [
    'domicilio de gas en medellín',
    'mantenimiento de calentador',
    'revisión de fuga de gas',
    'cambio de cilindro en envigado',
    'gas en valle de aburrá',
    'precio cilindro 40 lb',
  ];

  return dictionary.filter((item) => normalize(item).includes(query)).slice(0, 6);
}
