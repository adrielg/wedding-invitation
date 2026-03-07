import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, whatsapp, eventType, eventDate, briefMessage } = body;

    // Validaciones
    if (!paymentId || !whatsapp || !eventType) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: paymentId, whatsapp, eventType" },
        { status: 400 }
      );
    }

    // Modo de prueba en desarrollo
    if (paymentId.startsWith("test-") && process.env.NODE_ENV === "development") {
      return NextResponse.json({
        success: true,
        message: "Onboarding de prueba completado (modo desarrollo)",
        data: { paymentId, whatsapp, eventType, eventDate, briefMessage },
      });
    }

    // Verificar que el pago existe y es Premium
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    if (payment.plan !== "premium") {
      return NextResponse.json(
        { error: "Este endpoint es solo para el Plan Premium" },
        { status: 400 }
      );
    }

    if (payment.status !== "approved") {
      return NextResponse.json(
        { error: "El pago no está aprobado" },
        { status: 400 }
      );
    }

    if (payment.onboarding_completed) {
      return NextResponse.json(
        { error: "El onboarding ya fue completado" },
        { status: 400 }
      );
    }

    // Actualizar el pago con los datos del onboarding
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        whatsapp,
        event_type: eventType,
        event_date: eventDate ? new Date(eventDate) : null,
        brief_message: briefMessage || null,
        onboarding_completed: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error en premium-onboarding:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
