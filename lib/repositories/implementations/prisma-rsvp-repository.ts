import { prisma } from '@/lib/prisma'
import { IRsvpRepository } from '../interfaces/rsvp-repository.interface'
import { Rsvp, CreateRsvpDto } from '@/lib/types/rsvp.types'

export class PrismaRsvpRepository implements IRsvpRepository {
  async findAll(): Promise<Rsvp[]> {
    return await prisma.rsvp.findMany({
      orderBy: { created_at: 'desc' }
    }) as Rsvp[]
  }

  async findById(id: string): Promise<Rsvp | null> {
    return await prisma.rsvp.findUnique({
      where: { id }
    }) as Rsvp | null
  }

  async create(rsvp: CreateRsvpDto): Promise<Rsvp> {
    return await prisma.rsvp.create({
      data: rsvp
    }) as Rsvp
  }

  async count(): Promise<number> {
    return await prisma.rsvp.count()
  }
}
