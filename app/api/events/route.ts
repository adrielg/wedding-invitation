import { NextRequest, NextResponse } from 'next/server'
import { eventRepository } from '@/lib/repositories'
import { hashPassword } from '@/lib/utils/password'

// GET - Obtener todos los eventos
export async function GET() {
  try {
    const events = await eventRepository.findAll()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Hash password if provided
    if (body.password) {
      body.password = await hashPassword(body.password)
    }
    
    const event = await eventRepository.create(body)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Error al crear evento' },
      { status: 500 }
    )
  }
}
