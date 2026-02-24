# Script para sincronizar schema de Prisma con Supabase

# IMPORTANTE: Usa la conexión DIRECTA (puerto 5432), NO el pooler (6543)
# Ve a Supabase → Database Settings → Connection string → "Direct connection"
$env:DATABASE_URL = "postgresql://postgres.tczizfezmiqhitbyyory:events@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

Write-Host "Sincronizando schema con Supabase..." -ForegroundColor Cyan
npx prisma db push --accept-data-loss

Write-Host "`nListo! Las tablas fueron creadas en Supabase" -ForegroundColor Green
