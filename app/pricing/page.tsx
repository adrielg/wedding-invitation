"use client";

import { useState } from "react";
import Link from "next/link";
import WhatsAppFloat from "../components/WhatsAppFloat";
import Logo from "../components/Logo";

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Logo en la esquina */}
        <div className="mb-16">
          <Logo />
        </div>

        {/* Header */}
        <div className="text-center mb-20">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Elegí el plan <span className="block sm:inline">perfecto para</span>{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              tu evento
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Invitaciones profesionales que impresionan. Desde setup rápido hasta diseño completamente personalizado.
          </p>
          
          {/* Trust signals - diseño premium */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto">
            {/* Pago seguro */}
            <div className="flex items-center gap-3 backdrop-blur-sm bg-green-500/5 border border-green-500/10 rounded-xl px-5 py-3 hover:bg-green-500/10 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Pago Seguro</div>
                <div className="text-xs text-gray-500">Protección 100%</div>
              </div>
            </div>

            {/* Sin costos ocultos */}
            <div className="flex items-center gap-3 backdrop-blur-sm bg-blue-500/5 border border-blue-500/10 rounded-xl px-5 py-3 hover:bg-blue-500/10 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Pago Único</div>
                <div className="text-xs text-gray-500">Sin mensualidades</div>
              </div>
            </div>

            {/* Soporte incluido */}
            <div className="flex items-center gap-3 backdrop-blur-sm bg-violet-500/5 border border-violet-500/10 rounded-xl px-5 py-3 hover:bg-violet-500/10 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Soporte Incluido</div>
                <div className="text-xs text-gray-500">Ayuda cuando la necesites</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* STANDARD */}
          <div className="flex flex-col bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
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
              <p className="text-gray-400 text-sm">Creá tu evento en 5 minutos y empezá a recibir confirmaciones</p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {[
                "Evento listo en 5 minutos",
                "Diseños profesionales incluidos",
                "6 tipos de eventos (bodas, XV, etc.)",
                "Sabé quién viene en tiempo real",
                "Dashboard con estadísticas",
                "Descargá lista en Excel (1 click)",
                "Personalizá colores y tipografía",
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
              {loading === "standard" ? "Procesando..." : "Crear mi evento ahora"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">✓ Sin costos ocultos · Pago único</p>
          </div>

          {/* PREMIUM */}
          <div className="flex flex-col bg-gradient-to-br from-rose-900/20 to-violet-900/20 border-2 border-rose-500/50 rounded-2xl p-8 relative overflow-hidden">
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
              <p className="text-gray-400 text-sm">Relajate. Nosotros diseñamos todo por vos</p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {[
                "✨ Incluye TODO lo del Plan Standard",
                "Diseñamos tu evento único",
                "Te asesoramos por WhatsApp",
                "Ajustes ilimitados sin cargo",
                "Agregamos secciones extras",
                "Galería de fotos profesional",
                "Respuesta en menos de 24hs",
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
              {loading === "premium" ? "Procesando..." : "Quiero servicio premium"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">✓ Garantía de satisfacción 100%</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
          
          <div className="space-y-3">
            {[
              {
                q: "¿Cuántos eventos puedo crear con un pago?",
                a: "Cada pago te permite crear un evento completo. Si necesitás crear más eventos, simplemente realizás otro pago. No hay límite de invitados por evento."
              },
              {
                q: "¿Qué pasa después de pagar el Plan Standard?",
                a: "Inmediatamente después del pago, accederás a nuestro wizard de creación donde configurás todo en 4 pasos simples. En 5 minutos tendrás tu evento listo y el link para compartir."
              },
              {
                q: "¿Cómo funciona el Plan Premium?",
                a: "Después de pagar, te contactamos por WhatsApp para conocer tu visión. Diseñamos tu evento completamente personalizado y lo entregamos en 24-48hs con tu link + contraseña de admin."
              },
              {
                q: "¿Puedo editar mi evento después de crearlo?",
                a: "¡Sí! Podés editar todo (fecha, diseño, textos, etc.) desde tu panel de administración cuando quieras. Los cambios se reflejan instantáneamente."
              },
              {
                q: "¿Los invitados necesitan registrarse?",
                a: "No. Tus invitados solo entran al link que les compartas, confirman asistencia con su nombre y listo. Cero fricciones."
              },
              {
                q: "¿Hay algún costo oculto o mensualidad?",
                a: "Ninguno. Es un pago único por evento. Sin suscripciones, sin sorpresas. Tu evento queda activo permanentemente."
              }
            ].map((faq, i) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-all"
                  >
                    <span className="font-medium text-white pr-4">{faq.q}</span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth={2} 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {open && (
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* CTA adicional */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">¿Tenés más dudas?</p>
            <a
              href="https://wa.me/5493434386611?text=Hola!%20Tengo%20una%20consulta%20sobre%20los%20planes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white px-6 py-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chateá con nosotros
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
    </main>
  );
}
