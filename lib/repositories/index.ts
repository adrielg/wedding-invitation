import { PrismaRsvpRepository } from './implementations/prisma-rsvp-repository'
import { PrismaEventRepository } from './implementations/prisma-event-repository'

// Repositorios usando Prisma (compatible con PostgreSQL local y Supabase en producción)
export const rsvpRepository = new PrismaRsvpRepository()
export const eventRepository = new PrismaEventRepository()
