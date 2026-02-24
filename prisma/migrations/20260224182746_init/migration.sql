-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('wedding', 'quince', 'infantil', 'babyshower', 'corporativo', 'otro');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "owner_id" TEXT,
    "password" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_configs" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "requires_menu" BOOLEAN NOT NULL DEFAULT true,
    "requires_dietary" BOOLEAN NOT NULL DEFAULT true,
    "requires_allergies" BOOLEAN NOT NULL DEFAULT true,
    "max_adults" INTEGER NOT NULL DEFAULT 10,
    "max_children" INTEGER NOT NULL DEFAULT 10,
    "theme_primary_color" TEXT NOT NULL DEFAULT '#f43f5e',
    "theme_secondary_color" TEXT NOT NULL DEFAULT '#fda4af',
    "theme_background" TEXT NOT NULL DEFAULT 'gradient',
    "theme_font_family" TEXT NOT NULL DEFAULT 'Playfair Display',
    "hero_image_url" TEXT,
    "gallery_images" JSONB,
    "venue_name" TEXT,
    "venue_address" TEXT,
    "venue_map_url" TEXT,
    "ceremony_time" TEXT,
    "reception_time" TEXT,
    "parking_info" TEXT,
    "dress_code" TEXT,
    "timeline_events" JSONB,
    "custom_fields" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "asistencia" TEXT NOT NULL,
    "menores_cinco" INTEGER NOT NULL DEFAULT 0,
    "entre_cinco_diez" INTEGER NOT NULL DEFAULT 0,
    "mayores_diez" INTEGER NOT NULL DEFAULT 0,
    "restricciones_alimentarias" TEXT,
    "mensaje" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_configs_event_id_key" ON "event_configs"("event_id");

-- CreateIndex
CREATE INDEX "rsvps_event_id_idx" ON "rsvps"("event_id");

-- AddForeignKey
ALTER TABLE "event_configs" ADD CONSTRAINT "event_configs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
