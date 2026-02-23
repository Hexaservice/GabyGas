import { NextResponse } from 'next/server';
import { runUnifiedSearch } from '@/lib/search/engine';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';

  const data = await runUnifiedSearch(query);
  return NextResponse.json(data);
}
