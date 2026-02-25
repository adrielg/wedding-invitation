-- Rename EventType enum values from Spanish to English
-- Also add new types: adult_birthday, childrens_event, family_celebration

-- Recreate the enum with new values
-- 1. Rename old enum
ALTER TYPE "EventType" RENAME TO "EventType_old";

-- 2. Create new enum with English values
CREATE TYPE "EventType" AS ENUM ('wedding', 'fifteen', 'adult_birthday', 'childrens_event', 'babyshower', 'corporate', 'family_celebration', 'other');

-- 3. Migrate column, mapping old Spanish values to new English values
ALTER TABLE "events" ALTER COLUMN "type" TYPE "EventType" USING (
  CASE type::text
    WHEN 'quince' THEN 'fifteen'
    WHEN 'infantil' THEN 'childrens_event'
    WHEN 'corporativo' THEN 'corporate'
    WHEN 'otro' THEN 'other'
    ELSE type::text
  END
)::"EventType";

-- 4. Drop old enum
DROP TYPE "EventType_old";
