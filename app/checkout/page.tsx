import { prisma } from '@/lib/prisma';
import { CheckoutClient } from '@/components/shop/CheckoutClient';

export default async function CheckoutPage() {
  const zones = await prisma.coverageZone.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });

  return (
    <CheckoutClient
      zones={zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        city: zone.city,
        shippingCost: Number(zone.shippingCost),
      }))}
    />
  );
}
