-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_PENDING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAID';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_FAILED';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brand" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProvider" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentReference" TEXT;

-- CreateTable
CREATE TABLE "GuestCart" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GuestCart_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuestCartItem" (
    "id" TEXT NOT NULL,
    "guestCartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GuestCartItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceLead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "serviceType" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "preferredDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceLead_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "GuestCart_sessionId_key" ON "GuestCart"("sessionId");
CREATE UNIQUE INDEX "GuestCartItem_guestCartId_productId_key" ON "GuestCartItem"("guestCartId", "productId");

-- Foreign keys
ALTER TABLE "GuestCartItem" ADD CONSTRAINT "GuestCartItem_guestCartId_fkey" FOREIGN KEY ("guestCartId") REFERENCES "GuestCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuestCartItem" ADD CONSTRAINT "GuestCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
