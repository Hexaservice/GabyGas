import { NextResponse } from 'next/server';
import { registerSearchClick } from '@/lib/search/engine';

export async function POST(req: Request) {
  const body = await req.json();
  const { query, resultId, kind } = body as {
    query?: string;
    resultId?: string;
    kind?: 'service' | 'product' | 'faq';
  };

  if (!query || !resultId || !kind) {
    return NextResponse.json({ message: 'query, resultId y kind son obligatorios.' }, { status: 400 });
  }

  await registerSearchClick(query, resultId, kind);
  return NextResponse.json({ ok: true });
}
