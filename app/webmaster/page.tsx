import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { WebmasterDashboard } from '@/components/WebmasterDashboard';

export default async function WebmasterHomePage() {
  const session = await getServerSession(authOptions);
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const [banners, services, products, coverageZones, history, monthlyLeads, monthlyOrders, monthlyPaidOrders] = await Promise.all([
    prisma.banner.findMany({ orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }], take: 20 }),
    prisma.service.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    prisma.product.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    prisma.coverageZone.findMany({ orderBy: { updatedAt: 'desc' }, take: 20 }),
    prisma.auditLog.findMany({ where: { entity: 'site_settings', action: 'update_webmaster_content' }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.serviceLead.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.order.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.order.count({ where: { status: 'PAID', createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
  ]);

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Sesión activa como <strong>{session?.user?.name ?? session?.user?.email}</strong> ({session?.user?.role}).
      </p>
      <WebmasterDashboard
        initialSettings={{
          supportPhone: settings?.supportPhone ?? '',
          whatsappNumber: settings?.whatsappNumber ?? '',
          whatsappLink: settings?.seoCanonical ?? '',
          whatsappPrefilledMessage: settings?.seoDescription ?? '',
          logoUrl: settings?.logoUrl ?? '',
          facebookUrl: settings?.facebookUrl ?? '',
          instagramUrl: settings?.instagramUrl ?? '',
          tiktokUrl: settings?.tiktokUrl ?? '',
          youtubeUrl: settings?.youtubeUrl ?? '',
        }}
        banners={banners.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          ctaLabel: item.ctaLabel,
          ctaUrl: item.ctaUrl,
          imageUrl: item.imageUrl,
          isActive: item.isActive,
          priority: item.priority,
        }))}
        services={services.map((item) => ({
          id: item.id,
          name: item.name,
          shortDescription: item.shortDescription,
          isFeatured: item.isFeatured,
        }))}
        products={products.map((item) => ({
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price.toString(),
          stock: item.stock,
          isActive: item.isActive,
        }))}
        coverageZones={coverageZones.map((item) => ({
          id: item.id,
          name: item.name,
          city: item.city,
          isActive: item.isActive,
        }))}
        history={history.map((item) => ({
          id: item.id,
          action: item.action,
          createdAt: item.createdAt.toISOString(),
          actorEmail: item.actorEmail,
        }))}
        seoMetrics={{
          monthlyLeads,
          monthlyOrders,
          monthlyPaidOrders,
          leadToOrderRate: monthlyLeads > 0 ? Number(((monthlyOrders / monthlyLeads) * 100).toFixed(2)) : 0,
          orderToPaidRate: monthlyOrders > 0 ? Number(((monthlyPaidOrders / monthlyOrders) * 100).toFixed(2)) : 0,
          googleAnalyticsConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
          googleSearchConsoleConfigured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
        }}
      />
    </>
  );
}
