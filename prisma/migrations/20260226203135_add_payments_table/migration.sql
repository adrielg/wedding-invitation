-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('standard', 'premium');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected', 'refunded');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "plan" "PlanType" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amount" DOUBLE PRECISION NOT NULL,
    "mercadopago_id" TEXT,
    "preference_id" TEXT,
    "event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_mercadopago_id_key" ON "payments"("mercadopago_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_event_id_key" ON "payments"("event_id");

-- CreateIndex
CREATE INDEX "payments_email_idx" ON "payments"("email");

-- CreateIndex
CREATE INDEX "payments_mercadopago_id_idx" ON "payments"("mercadopago_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
