import { Prisma, SiteSettings } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AuditActor, createAuditLog } from '@/lib/audit';

const SITE_SETTINGS_ID = 1;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });
}

export async function upsertSiteSettings(
  data: Prisma.SiteSettingsCreateInput | Prisma.SiteSettingsUpdateInput,
): Promise<SiteSettings> {
  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: data,
    create: {
      id: SITE_SETTINGS_ID,
      siteName: 'GabyGas',
      ...data,
    },
  });
}

export async function updateBrandChannels(
  payload: {
    supportPhone?: string | null;
    salesPhone?: string | null;
    whatsappNumber?: string | null;
    logoUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
  },
  actor?: AuditActor,
): Promise<SiteSettings> {
  const before = await getSiteSettings();
  const updated = await upsertSiteSettings(payload);

  await createAuditLog({
    actor,
    action: 'update_brand_channels',
    entity: 'site_settings',
    entityId: String(SITE_SETTINGS_ID),
    before: before
      ? {
          supportPhone: before.supportPhone,
          salesPhone: before.salesPhone,
          whatsappNumber: before.whatsappNumber,
        }
      : null,
    after: {
      supportPhone: updated.supportPhone,
      salesPhone: updated.salesPhone,
      whatsappNumber: updated.whatsappNumber,
    },
  });

  return updated;
}
