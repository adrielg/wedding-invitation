import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const PRICES = {
  standard: 4999,
  premium: 9999,
};

export async function POST(req: NextRequest) {
  try {
    // Validar variables de entorno
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("❌ MERCADOPAGO_ACCESS_TOKEN no está configurado");
      return NextResponse.json(
        { error: "Configuración de pago no disponible" },
        { status: 500 }
      );
    }

    // Verificar tipo de credencial
    const tokenType = process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('TEST-') ? 'TEST' : 'PROD';
    console.log(`🔑 Usando credenciales de: ${tokenType}`);

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("❌ NEXT_PUBLIC_BASE_URL no está configurado");
      return NextResponse.json(
        { error: "Configuración de URLs no disponible" },
        { status: 500 }
      );
    }

    // Asegurar que la URL base tenga el protocolo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : `https://${process.env.NEXT_PUBLIC_BASE_URL}`;

    console.log("🔗 Base URL configurada:", baseUrl);

    const { plan, email, phone } = await req.json();

    if (!plan || !["standard", "premium"].includes(plan)) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    console.log("📋 Creando pago para plan:", plan);

    // Crear registro de pago pendiente
    const payment = await prisma.payment.create({
      data: {
        email: email || "cliente@email.com", // Temporal, se actualiza en webhook
        phone: phone || null,
        plan,
        status: "pending",
        amount: PRICES[plan as keyof typeof PRICES],
      },
    });

    console.log("✅ Pago registrado con ID:", payment.id);

    // Construir URLs de retorno
    const successUrl = `${baseUrl}/${plan === "standard" ? "create-event" : "premium-confirmed"}?payment_id=${payment.id}`;
    const failureUrl = `${baseUrl}/pricing?error=payment_failed`;
    const pendingUrl = `${baseUrl}/pricing?status=pending`;
    
    // MercadoPago no acepta auto_return con localhost
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
    
    console.log("🔗 URLs de retorno:", { successUrl, failureUrl, pendingUrl, isLocalhost });

    // Crear preferencia de MercadoPago
    const preference = new Preference(client);
    const preferenceBody: any = {
      items: [
        {
          id: payment.id,
          title: plan === "standard" ? "Plan Standard - Evento" : "Plan Premium - Evento Personalizado",
          description: plan === "standard" 
            ? "Creá tu evento instantáneamente con templates prediseñados"
            : "Evento diseñado 100% a medida por nuestro equipo",
          quantity: 1,
          unit_price: PRICES[plan as keyof typeof PRICES],
          currency_id: "ARS",
        },
      ],
      payer: {
        email: email || "cliente@email.com",
        phone: phone ? {
          area_code: "",
          number: phone,
        } : undefined,
      },
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      statement_descriptor: "RESERVALAFECHA",
      external_reference: payment.id,
      notification_url: `${baseUrl}/api/payments/webhook`,
      expires: false,
      binary_mode: false,
    };

    // Solo agregar auto_return en producción (no localhost)
    if (!isLocalhost) {
      preferenceBody.auto_return = "approved";
    }

    const result = await preference.create({
      body: preferenceBody,
    });

    console.log("✅ Preferencia de MercadoPago creada:", result.id);

    // Actualizar payment con preference_id
    await prisma.payment.update({
      where: { id: payment.id },
      data: { preference_id: result.id },
    });

    return NextResponse.json({
      preference_id: result.id,
      init_point: result.init_point, // URL para redirigir al usuario
    });
  } catch (error) {
    console.error("❌ Error creating MercadoPago preference:", error);
    
    // Más detalles del error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      return NextResponse.json(
        { 
          error: error.message,
          details: error.stack,
          type: error.constructor.name 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Error desconocido al procesar el pago",
        details: String(error) 
      },
      { status: 500 }
    );
  }
}
