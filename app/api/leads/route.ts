import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, phone, email, serviceType, address, city, notes, preferredDate } = body;

  if (!fullName || !phone || !serviceType) {
    return NextResponse.json({ message: 'Nombre, teléfono y tipo de servicio son obligatorios.' }, { status: 400 });
  }

  const lead = await prisma.serviceLead.create({
    data: {
      fullName,
      phone,
      email,
      serviceType,
      address,
      city,
      notes,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
    },
  });

  return NextResponse.json({ id: lead.id, message: 'Solicitud registrada. Te contactaremos pronto.' });
}
