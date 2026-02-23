import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/options';
import {
  getOrCreateGuestCart,
  getGuestCartSummary,
  getOrCreateUserCart,
  getUserCartSummary,
} from '@/lib/shop';

export async function POST(req: Request) {
  const { productId, quantity } = await req.json();
  const qty = Math.max(1, Number(quantity || 1));

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return NextResponse.json({ message: 'Producto no disponible.' }, { status: 404 });
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const cart = await getOrCreateUserCart(session.user.id);
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: qty }, price: product.price },
      create: { cartId: cart.id, productId, quantity: qty, price: product.price },
    });
    return NextResponse.json(await getUserCartSummary(session.user.id));
  }

  const guestCart = await getOrCreateGuestCart();

  await prisma.guestCartItem.upsert({
    where: {
      guestCartId_productId: {
        guestCartId: guestCart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: qty },
      price: product.price,
    },
    create: {
      guestCartId: guestCart.id,
      productId,
      quantity: qty,
      price: product.price,
    },
  });

  return NextResponse.json(await getGuestCartSummary());
}

export async function PATCH(req: Request) {
  const { itemId, quantity } = await req.json();
  const qty = Number(quantity);

  if (!itemId || Number.isNaN(qty)) {
    return NextResponse.json({ message: 'Datos inválidos.' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    if (qty <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: qty } });
    }

    return NextResponse.json(await getUserCartSummary(session.user.id));
  }

  if (qty <= 0) {
    await prisma.guestCartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.guestCartItem.update({ where: { id: itemId }, data: { quantity: qty } });
  }

  return NextResponse.json(await getGuestCartSummary());
}
