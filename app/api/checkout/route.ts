import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth/options';
import { getGuestCartSummary, getUserCartSummary } from '@/lib/shop';

function wompiCheckoutUrl(orderId: string, total: number) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const checkoutBase = process.env.WOMPI_CHECKOUT_URL ?? 'https://checkout.wompi.co/p/';

  if (!publicKey) {
    return `/checkout?orden=${orderId}&estado=pendiente_pago_mock`;
  }

  const amountInCents = Math.round(total * 100);
  const redirectUrl = process.env.WOMPI_REDIRECT_URL ?? 'http://localhost:3000/checkout';

  return `${checkoutBase}?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${orderId}&redirect-url=${encodeURIComponent(redirectUrl)}`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { customerName, customerPhone, customerAddress, coverageZoneId, notes } = body;
  const session = await getServerSession(authOptions);

  const cart = session?.user?.id ? await getUserCartSummary(session.user.id) : await getGuestCartSummary();

  if (!cart.items.length) {
    return NextResponse.json({ message: 'Tu carrito está vacío.' }, { status: 400 });
  }

  const zone = coverageZoneId
    ? await prisma.coverageZone.findUnique({ where: { id: coverageZoneId } })
    : null;

  const shipping = Number(zone?.shippingCost ?? 0);
  const total = cart.subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id,
      customerName,
      customerPhone,
      customerAddress,
      coverageZoneId: zone?.id,
      notes,
      status: 'PAYMENT_PENDING',
      paymentProvider: 'WOMPI',
      subtotal: cart.subtotal,
      shipping,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
        })),
      },
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentReference: order.id },
  });

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    paymentUrl: wompiCheckoutUrl(order.id, total),
  });
}
