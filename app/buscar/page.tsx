import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Buscar servicios y productos de gas',
  description: 'Encuentra servicios, productos y respuestas frecuentes sobre instalación y mantenimiento de gas.',
  path: '/buscar',
});

export default function BuscarPage() {
  return <SearchClient />;
}
