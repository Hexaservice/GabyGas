import { NextResponse } from 'next/server';
import { autocompleteSuggestions } from '@/lib/search/engine';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';

  return NextResponse.json({ suggestions: autocompleteSuggestions(query) });
}
