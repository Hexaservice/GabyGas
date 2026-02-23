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

export async function updateWebmasterContent(
  payload: {
    supportPhone?: string;
    whatsappNumber?: string;
    whatsappLink?: string;
    whatsappPrefilledMessage?: string;
    logoUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
  },
  actor?: AuditActor,
): Promise<SiteSettings> {
  const before = await getSiteSettings();

  const updated = await upsertSiteSettings({
    supportPhone: payload.supportPhone?.trim() || null,
    whatsappNumber: payload.whatsappNumber?.trim() || null,
    logoUrl: payload.logoUrl?.trim() || null,
    facebookUrl: payload.facebookUrl?.trim() || null,
    instagramUrl: payload.instagramUrl?.trim() || null,
    tiktokUrl: payload.tiktokUrl?.trim() || null,
    youtubeUrl: payload.youtubeUrl?.trim() || null,
    seoCanonical: payload.whatsappLink?.trim() || null,
    seoDescription: payload.whatsappPrefilledMessage?.trim() || null,
  });

  await createAuditLog({
    actor,
    action: 'update_webmaster_content',
    entity: 'site_settings',
    entityId: String(SITE_SETTINGS_ID),
    before: before
      ? {
          supportPhone: before.supportPhone,
          whatsappNumber: before.whatsappNumber,
          seoCanonical: before.seoCanonical,
          seoDescription: before.seoDescription,
          logoUrl: before.logoUrl,
          facebookUrl: before.facebookUrl,
          instagramUrl: before.instagramUrl,
          tiktokUrl: before.tiktokUrl,
          youtubeUrl: before.youtubeUrl,
        }
      : null,
    after: {
      supportPhone: updated.supportPhone,
      whatsappNumber: updated.whatsappNumber,
      seoCanonical: updated.seoCanonical,
      seoDescription: updated.seoDescription,
      logoUrl: updated.logoUrl,
      facebookUrl: updated.facebookUrl,
      instagramUrl: updated.instagramUrl,
      tiktokUrl: updated.tiktokUrl,
      youtubeUrl: updated.youtubeUrl,
    },
  });

  return updated;
}

export async function revertWebmasterContent(auditLogId: string, actor?: AuditActor): Promise<SiteSettings> {
  const log = await prisma.auditLog.findUnique({ where: { id: auditLogId } });

  if (!log || log.entity !== 'site_settings' || log.action !== 'update_webmaster_content') {
    throw new Error('No existe una versión válida para revertir.');
  }

  const before = (log.before ?? null) as {
    supportPhone?: string | null;
    whatsappNumber?: string | null;
    seoCanonical?: string | null;
    seoDescription?: string | null;
    logoUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
  } | null;

  if (!before) {
    throw new Error('La versión seleccionada no contiene estado previo.');
  }

  const current = await getSiteSettings();
  const restored = await upsertSiteSettings({
    supportPhone: before.supportPhone ?? null,
    whatsappNumber: before.whatsappNumber ?? null,
    seoCanonical: before.seoCanonical ?? null,
    seoDescription: before.seoDescription ?? null,
    logoUrl: before.logoUrl ?? null,
    facebookUrl: before.facebookUrl ?? null,
    instagramUrl: before.instagramUrl ?? null,
    tiktokUrl: before.tiktokUrl ?? null,
    youtubeUrl: before.youtubeUrl ?? null,
  });

  await createAuditLog({
    actor,
    action: 'revert_webmaster_content',
    entity: 'site_settings',
    entityId: String(SITE_SETTINGS_ID),
    before: current,
    after: restored,
  });

  return restored;
}
