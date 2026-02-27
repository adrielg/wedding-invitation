import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const paymentId = req.nextUrl.searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID requerido" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { event: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        plan: payment.plan,
        status: payment.status,
        email: payment.email,
        phone: payment.phone,
        amount: payment.amount,
        hasEvent: !!payment.event,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Error al verificar pago" }, { status: 500 });
  }
}
