import type { MetadataRoute } from 'next';
import { MUNICIPALITY_PAGES, SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/nosotros', '/servicios', '/tienda', '/contacto', '/buscar'];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
    lastModified: new Date(),
  }));

  const municipalityEntries = MUNICIPALITY_PAGES.map((item) => ({
    url: `${SITE_URL}/cobertura/${item.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...municipalityEntries];
}
