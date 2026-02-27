import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // MercadoPago envía diferentes tipos de notificaciones
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    
    // Consultar el pago a MercadoPago
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    // Buscar el pago en nuestra BD por external_reference
    const localPayment = await prisma.payment.findFirst({
      where: { id: paymentData.external_reference || "" },
    });

    if (!localPayment) {
      console.error("Payment not found:", paymentData.external_reference);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Actualizar estado del pago según MercadoPago
    const statusMap: Record<string, "pending" | "approved" | "rejected" | "refunded"> = {
      approved: "approved",
      pending: "pending",
      in_process: "pending",
      rejected: "rejected",
      cancelled: "rejected",
      refunded: "refunded",
      charged_back: "refunded",
    };

    await prisma.payment.update({
      where: { id: localPayment.id },
      data: {
        status: (paymentData.status && statusMap[paymentData.status]) || "pending",
        mercadopago_id: paymentData.id?.toString(),
        email: paymentData.payer?.email || localPayment.email,
        phone: paymentData.payer?.phone?.number || localPayment.phone,
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
