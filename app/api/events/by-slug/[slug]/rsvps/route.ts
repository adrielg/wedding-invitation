import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Buscar el evento por slug
    const event = await prisma.event.findUnique({
      where: { slug }
    })
    
    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    // Obtener RSVPs del evento
    const rsvps = await prisma.rsvp.findMany({
      where: { event_id: event.id },
      orderBy: { created_at: 'desc' }
    })
    
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Error al obtener confirmaciones' },
      { status: 500 }
    )
  }
}
