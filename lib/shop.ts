import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

export const CART_SESSION_COOKIE = 'gabygas_cart_session';

export type CartSummary = {
  items: Array<{
    id: string;
    productId: string;
    name: string;
    brand: string | null;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  totalItems: number;
};

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

function summarizeItems(
  items: Array<{ id: string; productId: string; quantity: number; price: unknown; product: { name: string; brand: string | null } }>,
): CartSummary {
  const mapped = items.map((item) => {
    const price = toNumber(item.price);
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      brand: item.product.brand,
      quantity: item.quantity,
      price,
      subtotal: price * item.quantity,
    };
  });

  return {
    items: mapped,
    subtotal: mapped.reduce((acc, item) => acc + item.subtotal, 0),
    totalItems: mapped.reduce((acc, item) => acc + item.quantity, 0),
  };
}

export async function ensureGuestSessionId() {
  const store = cookies();
  let sessionId = store.get(CART_SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    store.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return sessionId;
}

export async function getOrCreateGuestCart() {
  const sessionId = await ensureGuestSessionId();

  return prisma.guestCart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });
}

export async function getOrCreateUserCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getGuestCartSummary(): Promise<CartSummary> {
  const sessionId = cookies().get(CART_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  const cart = await prisma.guestCart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  return summarizeItems(cart.items);
}

export async function getUserCartSummary(userId: string): Promise<CartSummary> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  return summarizeItems(cart.items);
}
