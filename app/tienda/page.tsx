import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { TiendaCatalogo } from '@/components/shop/TiendaCatalogo';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Tienda de productos para gas',
  description: 'Compra productos para instalación y mantenimiento de gas con disponibilidad y soporte técnico especializado.',
  path: '/tienda',
});

export default async function TiendaPage() {
  const [products, services, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.service.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const mappedProducts = products.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category.name,
    categorySlug: item.category.seoSlug,
    brand: item.brand,
    price: Number(item.price),
    stock: item.stock,
  }));

  const brands = Array.from(new Set(mappedProducts.map((item) => item.brand ?? 'Sin marca'))).sort();

  return (
    <TiendaCatalogo
      products={mappedProducts}
      services={services.map((service) => ({ id: service.id, name: service.name, shortDescription: service.shortDescription }))}
      categories={categories.map((category) => ({ slug: category.seoSlug, name: category.name }))}
      brands={brands}
    />
  );
}
