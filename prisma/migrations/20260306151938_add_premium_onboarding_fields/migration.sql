-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "brief_message" TEXT,
ADD COLUMN     "event_date" TIMESTAMP(3),
ADD COLUMN     "event_type" TEXT,
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsapp" TEXT;
