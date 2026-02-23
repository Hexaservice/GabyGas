import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';
import { updateWebmasterContent } from '@/lib/repositories/siteSettingsRepository';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const payload = (await request.json()) as {
    supportPhone?: string;
    whatsappNumber?: string;
    whatsappLink?: string;
    whatsappPrefilledMessage?: string;
    logoUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
  };

  try {
    await updateWebmasterContent(payload, { id: session.user.id, email: session.user.email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al publicar cambios.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
