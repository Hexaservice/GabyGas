import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getGuestCartSummary, getUserCartSummary } from '@/lib/shop';

export async function GET() {
  const session = await getServerSession(authOptions);
  const cart = session?.user?.id ? await getUserCartSummary(session.user.id) : await getGuestCartSummary();
  return NextResponse.json(cart);
}
