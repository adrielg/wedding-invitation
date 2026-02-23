import { prisma } from '@/lib/prisma'
import { IEventRepository } from '../interfaces/event-repository.interface'
import { Event, EventWithConfig, CreateEventDto, UpdateEventDto } from '@/lib/types/event.types'

export class PrismaEventRepository implements IEventRepository {
  async findAll(): Promise<Event[]> {
    return await prisma.event.findMany({
      orderBy: { created_at: 'desc' }
    }) as Event[]
  }

  async findBySlug(slug: string): Promise<EventWithConfig | null> {
    return await prisma.event.findUnique({
      where: { slug },
      include: { config: true }
    }) as EventWithConfig | null
  }

  async findById(id: string): Promise<EventWithConfig | null> {
    return await prisma.event.findUnique({
      where: { id },
      include: { config: true }
    }) as EventWithConfig | null
  }

  async create(eventDto: CreateEventDto): Promise<Event> {
    const { config, ...eventData } = eventDto
    
    return await prisma.event.create({
      data: {
        ...eventData,
        config: config ? {
          create: config
        } : undefined
      }
    }) as Event
  }

  async update(id: string, eventDto: UpdateEventDto): Promise<Event> {
    const { config, ...restData } = eventDto;
    
    return await prisma.event.update({
      where: { id },
      data: {
        ...restData,
        ...(config && {
          config: {
            update: config
          }
        })
      }
    }) as Event
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id }
    })
  }

  async count(): Promise<number> {
    return await prisma.event.count()
  }
}
