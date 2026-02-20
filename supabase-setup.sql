-- ============================================
-- ORDEN CORRECTO: Primero el tipo, luego las tablas
-- ============================================

-- 1. Crear ENUM primero
CREATE TYPE public."EventType" AS ENUM (
	'wedding',
	'quince',
	'infantil',
	'babyshower',
	'corporativo',
	'otro'
);

-- 2. Crear tabla events
CREATE TABLE public.events (
	id text NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"type" public."EventType" NOT NULL,
	"date" timestamp(3) NOT NULL,
	"location" text NULL,
	description text NULL,
	owner_id text NULL,
	is_active bool DEFAULT true NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"password" text NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);

-- 3. Crear tabla event_configs
CREATE TABLE public.event_configs (
	id text NOT NULL,
	event_id text NOT NULL,
	requires_menu bool DEFAULT true NOT NULL,
	requires_dietary bool DEFAULT true NOT NULL,
	requires_allergies bool DEFAULT true NOT NULL,
	max_adults int4 DEFAULT 10 NOT NULL,
	max_children int4 DEFAULT 10 NOT NULL,
	custom_fields jsonb NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	gallery_images jsonb NULL,
	hero_image_url text NULL,
	theme_background text DEFAULT 'gradient'::text NOT NULL,
	theme_font_family text DEFAULT 'Playfair Display'::text NOT NULL,
	theme_primary_color text DEFAULT '#f43f5e'::text NOT NULL,
	theme_secondary_color text DEFAULT '#fda4af'::text NOT NULL,
	ceremony_time text NULL,
	dress_code text NULL,
	parking_info text NULL,
	reception_time text NULL,
	timeline_events jsonb NULL,
	venue_address text NULL,
	venue_map_url text NULL,
	venue_name text NULL,
	CONSTRAINT event_configs_pkey PRIMARY KEY (id),
	CONSTRAINT event_configs_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX event_configs_event_id_key ON public.event_configs USING btree (event_id);

-- 4. Crear tabla rsvps
CREATE TABLE public.rsvps (
	id text NOT NULL,
	event_id text NOT NULL,
	nombre text NOT NULL,
	apellido text NOT NULL,
	asistencia text NOT NULL,
	menores_cinco int4 DEFAULT 0 NOT NULL,
	entre_cinco_diez int4 DEFAULT 0 NOT NULL,
	mayores_diez int4 DEFAULT 0 NOT NULL,
	restricciones_alimentarias text NULL,
	mensaje text NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT rsvps_pkey PRIMARY KEY (id),
	CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX rsvps_event_id_idx ON public.rsvps USING btree (event_id);
