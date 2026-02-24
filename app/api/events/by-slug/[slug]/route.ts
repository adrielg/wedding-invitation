import { NextRequest, NextResponse } from 'next/server'
import { eventRepository } from '@/lib/repositories'

// GET - Obtener evento por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const event = await eventRepository.findBySlug(slug)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Error al obtener evento' },
      { status: 500 }
    )
  }
}
