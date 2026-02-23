import { Prisma, SiteSettings } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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

export async function updateBrandChannels(payload: {
  supportPhone?: string | null;
  salesPhone?: string | null;
  whatsappNumber?: string | null;
  logoUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
}): Promise<SiteSettings> {
  return upsertSiteSettings(payload);
}
