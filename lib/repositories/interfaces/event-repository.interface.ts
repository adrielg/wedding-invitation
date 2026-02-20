import { Event, EventWithConfig, CreateEventDto, UpdateEventDto } from '@/lib/types/event.types'

export interface IEventRepository {
  findAll(): Promise<Event[]>
  findBySlug(slug: string): Promise<EventWithConfig | null>
  findById(id: string): Promise<EventWithConfig | null>
  create(event: CreateEventDto): Promise<Event>
  update(id: string, event: UpdateEventDto): Promise<Event>
  delete(id: string): Promise<void>
  count(): Promise<number>
}
