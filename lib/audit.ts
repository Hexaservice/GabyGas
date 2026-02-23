import { prisma } from '@/lib/prisma';

export type AuditActor = {
  id?: string | null;
  email?: string | null;
};

export async function createAuditLog(params: {
  actor?: AuditActor;
  action: string;
  entity: 'site_settings' | 'banner' | 'product';
  entityId?: string;
  before?: unknown;
  after?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: params.actor?.id ?? null,
      actorEmail: params.actor?.email ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      before: params.before as object | undefined,
      after: params.after as object | undefined,
    },
  });
}
