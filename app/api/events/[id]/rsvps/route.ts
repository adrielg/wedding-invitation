import { NextRequest, NextResponse } from 'next/server'
import { rsvpRepository } from '@/lib/repositories'
import { prisma } from '@/lib/prisma'

// GET - Obtener RSVPs de un evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Obtener RSVPs usando Prisma directamente para filtrar por event_id
    const rsvps = await prisma.rsvp.findMany({
      where: { event_id: id },
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
