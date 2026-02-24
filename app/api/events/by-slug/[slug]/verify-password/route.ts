import { NextRequest, NextResponse } from 'next/server'
import { eventRepository } from '@/lib/repositories'
import { verifyPassword } from '@/lib/utils/password'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { password } = await request.json()
    
    console.log('🔍 Verify password request:')
    console.log('  - Slug:', slug)
    console.log('  - Password recibida:', password)
    console.log('  - Password length:', password?.length)
    console.log('  - Password type:', typeof password)
    
    const event = await eventRepository.findBySlug(slug)
    
    if (!event) {
      console.log('❌ Evento no encontrado:', slug)
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('  - Event password hash:', event.password)
    console.log('  - Event password exists:', !!event.password)
    
    // Verificar contraseña
    const passwordMatch = await verifyPassword(password, event.password || '')
    console.log('  - Password match result:', passwordMatch)
    
    if (!event.password || !passwordMatch) {
      console.log('❌ Contraseña incorrecta')
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }
    
    console.log('✅ Contraseña correcta')
    
    // Generar token simple (base64 del eventId + timestamp)
    const token = Buffer.from(`${event.id}:${Date.now()}`).toString('base64')
    
    return NextResponse.json({ token, eventId: event.id })
  } catch (error) {
    console.error('Error verifying password:', error)
    return NextResponse.json(
      { error: 'Error al verificar contraseña' },
      { status: 500 }
    )
  }
}
