import { NextRequest, NextResponse } from 'next/server'
import { rsvpRepository } from '@/lib/repositories'

// GET - Obtener todos los RSVPs
export async function GET() {
  try {
    const rsvps = await rsvpRepository.findAll()
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Error al obtener confirmaciones' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rsvp = await rsvpRepository.create(body)
    return NextResponse.json(rsvp, { status: 201 })
  } catch (error) {
    console.error('Error creating RSVP:', error)
    return NextResponse.json(
      { error: 'Error al crear confirmación' },
      { status: 500 }
    )
  }
}
