import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';
import { updateBannerById } from '@/lib/repositories/bannerRepository';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = (await request.json()) as {
    bannerId?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    imageUrl?: string;
  };

  if (!body.bannerId || !body.title?.trim()) {
    return NextResponse.json({ error: 'bannerId y title son requeridos.' }, { status: 400 });
  }

  try {
    await updateBannerById(
      body.bannerId,
      {
        title: body.title,
        subtitle: body.subtitle ?? null,
        ctaLabel: body.ctaLabel ?? null,
        ctaUrl: body.ctaUrl ?? null,
        imageUrl: body.imageUrl ?? null,
      },
      { id: session.user.id, email: session.user.email },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el banner.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
