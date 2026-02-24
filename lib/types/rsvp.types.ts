export interface Rsvp {
  id: string
  event_id: string  // ← NUEVO
  nombre: string
  apellido: string
  asistencia: 'si' | 'no' | 'quizas'
  menores_cinco: number
  entre_cinco_diez: number
  mayores_diez: number
  restricciones_alimentarias: string | null
  mensaje: string | null
  created_at: Date
}

export interface CreateRsvpDto {
  event_id: string  // ← NUEVO (requerido)
  nombre: string
  apellido: string
  asistencia: 'si' | 'no' | 'quizas'
  menores_cinco: number
  entre_cinco_diez: number
  mayores_diez: number
  restricciones_alimentarias?: string | null
  mensaje?: string | null
}
