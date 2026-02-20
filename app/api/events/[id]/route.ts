import { NextRequest, NextResponse } from 'next/server'
import { eventRepository } from '@/lib/repositories'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/utils/password'

// GET - Obtener evento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await eventRepository.findById(id)
    
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

// PUT - Actualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { config, ...eventData } = body
    
    // Hash password if provided
    if (eventData.password) {
      eventData.password = await hashPassword(eventData.password)
    }
    
    // Actualizar evento
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        config: config ? {
          upsert: {
            create: config,
            update: config
          }
        } : undefined
      },
      include: { config: true }
    })
    
    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Error al actualizar evento' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar estado activo/inactivo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_active } = body
    
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active debe ser un booleano' },
        { status: 400 }
      )
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { is_active }
    })
    
    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event status:', error)
    return NextResponse.json(
      { error: 'Error al actualizar estado del evento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verificar si el evento existe
    const event = await eventRepository.findById(id)
    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    // Eliminar evento (esto también eliminará RSVPs por cascada)
    await eventRepository.delete(id)
    
    return NextResponse.json({ message: 'Evento eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Error al eliminar evento' },
      { status: 500 }
    )
  }
}
