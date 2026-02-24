import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Panel de administración",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

# Password de admin
ADMIN_PASSWORD=casamiento2026

# Desarrollo local (Docker)
DATABASE_URL="postgresql://postgres:password@localhost:54322/postgres?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:54322/postgres?schema=public"

# Para probar con Supabase en lugar de Docker (opcional)
# Descomenta y reemplaza con tus valores reales:
# DATABASE_URL="postgresql://postgres.TU_PROJECT_ID:[TU_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.TU_PROJECT_ID:[TU_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
# NEXT_PUBLIC_USE_SUPABASE=true

# NO uses Supabase en local
NEXT_PUBLIC_USE_SUPABASE=false