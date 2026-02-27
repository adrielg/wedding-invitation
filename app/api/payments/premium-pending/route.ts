import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const premiumPayments = await prisma.payment.findMany({
      where: {
        plan: "premium",
        status: "approved",
        event_id: null, // Sin evento asignado
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(premiumPayments);
  } catch (error) {
    console.error("Error fetching premium payments:", error);
    return NextResponse.json(
      { error: "Error al obtener pagos premium" },
      { status: 500 }
    );
  }
}
