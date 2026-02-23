import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';
import { revertWebmasterContent } from '@/lib/repositories/siteSettingsRepository';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = (await request.json()) as { auditLogId?: string };

  if (!body.auditLogId) {
    return NextResponse.json({ error: 'auditLogId es requerido.' }, { status: 400 });
  }

  try {
    await revertWebmasterContent(body.auditLogId, { id: session.user.id, email: session.user.email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo revertir.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
