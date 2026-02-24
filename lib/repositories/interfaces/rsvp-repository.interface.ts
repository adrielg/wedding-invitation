import { Rsvp, CreateRsvpDto } from '@/lib/types/rsvp.types'

export interface IRsvpRepository {
  findAll(): Promise<Rsvp[]>
  findById(id: string): Promise<Rsvp | null>
  create(rsvp: CreateRsvpDto): Promise<Rsvp>
  count(): Promise<number>
}
