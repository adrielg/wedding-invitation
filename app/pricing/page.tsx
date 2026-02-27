"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState<"standard" | "premium" | null>(null);

  const handlePayment = async (plan: "standard" | "premium") => {
    setLoading(plan);
    try {
      const response = await fetch("/api/payments/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Response text:", responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: `Error del servidor (${response.status})` };
        }
        
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.error || errorData.details || "Error al crear preferencia");
      }

      const { init_point } = await response.json();
      window.location.href = init_point; // Redirige a MercadoPago
    } catch (error) {
      console.error("Error completo:", error);
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}. Intentá nuevamente.`);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Elegí tu <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">plan</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Seleccioná el plan que mejor se adapte a tu evento. Cada pago permite crear un evento.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* STANDARD */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Plan Standard</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-4xl font-bold">$4.999</span>
                <span className="text-gray-500 text-sm">por evento</span>
              </div>
              <p className="text-gray-400 text-sm">Creá tu evento de forma rápida y sencilla</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Creación instantánea del evento",
                "Templates prediseñados",
                "6 tipos de eventos disponibles",
                "Gestión de confirmaciones",
                "Panel de control completo",
                "Exportación a Excel",
                "Personalización de colores",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment("standard")}
              disabled={loading === "standard"}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "standard" ? "Procesando..." : "Elegir Standard"}
            </button>
          </div>

          {/* PREMIUM */}
          <div className="bg-gradient-to-br from-rose-900/20 to-violet-900/20 border-2 border-rose-500/50 rounded-2xl p-8 relative overflow-hidden">
            {/* Badge "Recomendado" */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ⭐ Recomendado
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-4">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Plan Premium</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">$9.999</span>
                <span className="text-gray-500 text-sm">por evento</span>
              </div>
              <p className="text-gray-400 text-sm">Nosotros diseñamos tu evento a medida</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Todo lo del Plan Standard",
                "Diseño 100% personalizado",
                "Asesoramiento directo",
                "Revisiones ilimitadas",
                "Secciones customizadas",
                "Imágenes y galería incluidas",
                "Soporte prioritario 24/7",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment("premium")}
              disabled={loading === "premium"}
              className="w-full bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "premium" ? "Procesando..." : "Elegir Premium"}
            </button>
          </div>
        </div>

        {/* FAQ / Nota */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              Información importante
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Cada pago te permite crear <strong className="text-white">un evento</strong>.</li>
              <li>• Con el <strong className="text-white">Plan Standard</strong>, creás tu evento inmediatamente después de pagar.</li>
              <li>• Con el <strong className="text-white">Plan Premium</strong>, nos contactamos por WhatsApp para diseñarlo juntos.</li>
              <li>• Podés editar tu evento desde el panel de administración cuando quieras.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
