import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AuditActor, createAuditLog } from '@/lib/audit';

export async function updateBannerById(
  bannerId: string,
  data: Prisma.BannerUpdateInput,
  actor?: AuditActor,
) {
  const previous = await prisma.banner.findUnique({ where: { id: bannerId } });

  const banner = await prisma.banner.update({
    where: { id: bannerId },
    data,
  });

  await createAuditLog({
    actor,
    action: 'update_banner',
    entity: 'banner',
    entityId: banner.id,
    before: previous,
    after: banner,
  });

  return banner;
}
