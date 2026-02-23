import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AuditActor, createAuditLog } from '@/lib/audit';

export async function updateProductById(
  productId: string,
  data: Prisma.ProductUpdateInput,
  actor?: AuditActor,
) {
  const previous = await prisma.product.findUnique({ where: { id: productId } });

  const product = await prisma.product.update({
    where: { id: productId },
    data,
  });

  await createAuditLog({
    actor,
    action: 'update_product',
    entity: 'product',
    entityId: product.id,
    before: previous,
    after: product,
  });

  return product;
}

export async function updateProductPrice(
  productId: string,
  price: Prisma.Decimal | number | string,
  actor?: AuditActor,
) {
  const previous = await prisma.product.findUnique({ where: { id: productId } });

  const product = await prisma.product.update({
    where: { id: productId },
    data: { price },
  });

  await createAuditLog({
    actor,
    action: 'update_product_price',
    entity: 'product',
    entityId: product.id,
    before: previous ? { price: previous.price } : null,
    after: { price: product.price },
  });

  return product;
}
