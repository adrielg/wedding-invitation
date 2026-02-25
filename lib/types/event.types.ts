import { EventTypeValue } from '../constants/event-types'

export type EventType = EventTypeValue

export interface Event {
  id: string
  slug: string
  name: string
  type: EventType
  date: Date
  location: string | null
  description: string | null
  owner_id: string | null
  password: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface EventConfig {
  id: string
  event_id: string
  requires_menu: boolean
  requires_dietary: boolean
  requires_allergies: boolean
  max_adults: number
  max_children: number
  custom_fields: Record<string, any> | null
  created_at: Date
  updated_at: Date
}

export interface EventWithConfig extends Event {
  config: EventConfig | null
}

export interface CreateEventDto {
  slug: string
  name: string
  type: EventType
  date: Date | string
  location?: string
  description?: string
  owner_id?: string
  config?: CreateEventConfigDto
}

export interface CreateEventConfigDto {
  requires_menu?: boolean
  requires_dietary?: boolean
  requires_allergies?: boolean
  max_adults?: number
  max_children?: number
  custom_fields?: Record<string, any>
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}
