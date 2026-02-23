import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { description: 'Administrador general de la plataforma' },
    create: {
      name: 'ADMIN',
      description: 'Administrador general de la plataforma',
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'EDITOR' },
    update: { description: 'Editor con permisos de gestión de contenido y productos' },
    create: {
      name: 'EDITOR',
      description: 'Editor con permisos de gestión de contenido y productos',
    },
  });

  await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: { description: 'Cliente final' },
    create: {
      name: 'CUSTOMER',
      description: 'Cliente final',
    },
  });

  const defaultAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!';
  const defaultEditorPassword = process.env.SEED_EDITOR_PASSWORD ?? 'Editor1234!';

  await prisma.user.upsert({
    where: { email: 'admin@gabygas.com' },
    update: {
      fullName: 'Administrador GabyGas',
      roleId: adminRole.id,
      passwordHash: await hash(defaultAdminPassword, 12),
    },
    create: {
      fullName: 'Administrador GabyGas',
      email: 'admin@gabygas.com',
      passwordHash: await hash(defaultAdminPassword, 12),
      phone: '+57 3000000000',
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@gabygas.com' },
    update: {
      fullName: 'Editor GabyGas',
      roleId: editorRole.id,
      passwordHash: await hash(defaultEditorPassword, 12),
    },
    create: {
      fullName: 'Editor GabyGas',
      email: 'editor@gabygas.com',
      passwordHash: await hash(defaultEditorPassword, 12),
      phone: '+57 3010000001',
      roleId: editorRole.id,
    },
  });

  const domesticCategory = await prisma.category.upsert({
    where: { seoSlug: 'gas-domestico' },
    update: { name: 'Gas doméstico' },
    create: {
      name: 'Gas doméstico',
      description: 'Productos de gas para uso residencial.',
      seoSlug: 'gas-domestico',
      seoTitle: 'Gas doméstico para el hogar | GabyGas',
      seoDescription: 'Cilindros y recargas de gas doméstico con entrega rápida.',
      seoSchemaType: 'CollectionPage',
      seoCanonical: 'https://gabygas.com/tienda/gas-domestico',
    },
  });

  const services = [
    {
      name: 'Domicilio express de gas',
      shortDescription: 'Entrega en menos de 60 minutos en zonas habilitadas.',
      description: 'Entrega de cilindros de gas para cocina en casas y apartamentos.',
      seoSlug: 'domicilio-express-gas',
    },
    {
      name: 'Cambio de cilindro',
      shortDescription: 'Cambio seguro con personal capacitado.',
      description: 'Retiro del cilindro vacío e instalación del cilindro nuevo.',
      seoSlug: 'cambio-de-cilindro',
    },
    {
      name: 'Revisión básica de conexión',
      shortDescription: 'Revisión visual de mangueras y regulador.',
      description: 'Validación de estado general de conexiones y recomendaciones.',
      seoSlug: 'revision-basica-conexion-gas',
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { seoSlug: service.seoSlug },
      update: {
        name: service.name,
        shortDescription: service.shortDescription,
        description: service.description,
      },
      create: {
        ...service,
        seoTitle: `${service.name} | GabyGas`,
        seoDescription: service.shortDescription,
        seoSchemaType: 'Service',
        seoCanonical: `https://gabygas.com/servicios/${service.seoSlug}`,
      },
    });
  }

  const products = [
    {
      name: 'Cilindro 20 lb',
      sku: 'GAS-20LB',
      description: 'Ideal para hogares de consumo bajo a medio.',
      price: 68000,
      stock: 100,
      seoSlug: 'cilindro-20-lb',
    },
    {
      name: 'Cilindro 40 lb',
      sku: 'GAS-40LB',
      description: 'Alta duración para familias grandes y pequeños comercios.',
      price: 128000,
      stock: 70,
      seoSlug: 'cilindro-40-lb',
    },
    {
      name: 'Cilindro 100 lb',
      sku: 'GAS-100LB',
      description: 'Solución para consumo intensivo o negocio.',
      price: 289000,
      stock: 30,
      seoSlug: 'cilindro-100-lb',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
      create: {
        ...product,
        categoryId: domesticCategory.id,
        seoTitle: `${product.name} | GabyGas`,
        seoDescription: product.description,
        seoSchemaType: 'Product',
        seoCanonical: `https://gabygas.com/tienda/${product.seoSlug}`,
      },
    });
  }

  const zones = [
    { name: 'Medellín', city: 'Medellín', estimatedMinutes: 45, shippingCost: 7000 },
    { name: 'Bello', city: 'Bello', estimatedMinutes: 55, shippingCost: 8000 },
    { name: 'Sabaneta', city: 'Sabaneta', estimatedMinutes: 50, shippingCost: 7000 },
    { name: 'Itagüí', city: 'Itagüí', estimatedMinutes: 50, shippingCost: 7000 },
    { name: 'Envigado', city: 'Envigado', estimatedMinutes: 45, shippingCost: 7000 },
    {
      name: 'Valle de Aburrá',
      city: 'Área Metropolitana del Valle de Aburrá',
      estimatedMinutes: 70,
      shippingCost: 10000,
    },
  ];

  for (const zone of zones) {
    await prisma.coverageZone.upsert({
      where: { name: zone.name },
      update: zone,
      create: zone,
    });
  }

  const pages = [
    { key: 'home', title: 'Inicio', seoSlug: 'inicio' },
    { key: 'nosotros', title: 'Nosotros', seoSlug: 'nosotros' },
    { key: 'servicios', title: 'Servicios', seoSlug: 'servicios' },
    { key: 'tienda', title: 'Tienda', seoSlug: 'tienda' },
    { key: 'contacto', title: 'Contacto', seoSlug: 'contacto' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { key: page.key },
      update: {
        title: page.title,
        seoSlug: page.seoSlug,
      },
      create: {
        ...page,
        seoTitle: `${page.title} | GabyGas`,
        seoDescription: `${page.title} de GabyGas, tu aliado en distribución de gas doméstico.`,
        seoSchemaType: 'WebPage',
        seoCanonical: `https://gabygas.com/${page.seoSlug === 'inicio' ? '' : page.seoSlug}`,
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      supportPhone: '+57 604 444 0000',
      salesPhone: '+57 301 000 0000',
      whatsappNumber: '+57 301 000 0000',
      logoUrl: '/logo-gabygas.svg',
      facebookUrl: 'https://facebook.com/gabygas',
      instagramUrl: 'https://instagram.com/gabygas',
      tiktokUrl: 'https://tiktok.com/@gabygas',
      youtubeUrl: 'https://youtube.com/@gabygas',
    },
    create: {
      id: 1,
      siteName: 'GabyGas',
      supportPhone: '+57 604 444 0000',
      salesPhone: '+57 301 000 0000',
      whatsappNumber: '+57 301 000 0000',
      logoUrl: '/logo-gabygas.svg',
      facebookUrl: 'https://facebook.com/gabygas',
      instagramUrl: 'https://instagram.com/gabygas',
      tiktokUrl: 'https://tiktok.com/@gabygas',
      youtubeUrl: 'https://youtube.com/@gabygas',
      seoSlug: 'configuracion-global',
      seoTitle: 'Configuración global | GabyGas',
      seoDescription: 'Configuración general editable de canales de contacto y marca.',
      seoSchemaType: 'Organization',
      seoCanonical: 'https://gabygas.com/admin/site-settings',
    },
  });

  await prisma.banner.upsert({
    where: { seoSlug: 'entrega-rapida-gas-medellin' },
    update: {
      title: 'Gas doméstico con entrega rápida',
      subtitle: 'Cobertura en Medellín y el Valle de Aburrá',
      ctaLabel: 'Pedir ahora',
      ctaUrl: '/tienda',
      isActive: true,
      priority: 1,
    },
    create: {
      title: 'Gas doméstico con entrega rápida',
      subtitle: 'Cobertura en Medellín y el Valle de Aburrá',
      ctaLabel: 'Pedir ahora',
      ctaUrl: '/tienda',
      isActive: true,
      priority: 1,
      seoSlug: 'entrega-rapida-gas-medellin',
      seoTitle: 'Entrega rápida de gas en Medellín | GabyGas',
      seoDescription: 'Pide tu cilindro de gas con despacho seguro y oportuno.',
      seoSchemaType: 'WPAdBlock',
      seoCanonical: 'https://gabygas.com',
    },
  });

  console.log('Seed completado correctamente.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
