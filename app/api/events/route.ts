import { NextRequest, NextResponse } from 'next/server'
import { eventRepository } from '@/lib/repositories'
import { hashPassword } from '@/lib/utils/password'
import { prisma } from '@/lib/prisma'

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
    const { paymentId, ...eventData } = body;
    
    // Si viene paymentId, validar que sea standard y no usado
    if (paymentId) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { event: true },
      });

      if (!payment) {
        return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
      }

      if (payment.status !== "approved") {
        return NextResponse.json({ error: "Pago no aprobado" }, { status: 400 });
      }

      if (payment.plan !== "standard") {
        return NextResponse.json({ error: "Este pago no es Plan Standard" }, { status: 400 });
      }

      if (payment.event) {
        return NextResponse.json({ error: "Este pago ya fue utilizado" }, { status: 400 });
      }
    }
    
    // Generar contraseña aleatoria si no se proporciona
    const plainPassword = eventData.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(plainPassword);
    
    // Crear evento
    const event = await eventRepository.create({
      ...eventData,
      password: hashedPassword,
    });

    // Si había payment, vincularlo
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { event_id: event.id },
      });
    }
    
    return NextResponse.json({ event, password: plainPassword }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Error al crear evento' },
      { status: 500 }
    )
  }
}
