"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";

function PremiumConfirmedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("payment_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    whatsapp: "",
    eventType: "",
    eventDate: "",
    briefMessage: "",
  });

  useEffect(() => {
    if (!paymentId) {
      setError("No se encontró información de pago");
      setLoading(false);
      return;
    }

    fetch(`/api/payments/verify?payment_id=${paymentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.payment.status !== "approved") {
          setError("El pago aún no fue aprobado");
          return;
        }

        if (data.payment.plan !== "premium") {
          setError("Este link es solo para el Plan Premium");
          return;
        }

        setPayment(data.payment);
      })
      .catch(() => setError("Error al verificar el pago"))
      .finally(() => setLoading(false));
  }, [paymentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/payments/premium-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      alert("Error al enviar los datos. Por favor, intentá de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando pago...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/pricing" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
            Volver a Pricing
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/10 to-violet-500/10 border-2 border-rose-500/50 mb-6">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            ¡Perfecto, <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">ya tenemos tus datos</span>!
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">Te contactaremos por WhatsApp en las próximas 24 horas</p>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-semibold mb-6">¿Qué sigue ahora?</h3>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">1. Te llamamos por WhatsApp</h4>
                  <p className="text-gray-400 text-sm">Conversamos sobre tu visión, estilo y necesidades específicas.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">2. Diseñamos tu evento único</h4>
                  <p className="text-gray-400 text-sm">Creamos una invitación completamente personalizada en 24-48hs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">3. Recibís tu link + contraseña</h4>
                  <p className="text-gray-400 text-sm">Listo para compartir y gestionar desde tu panel de admin.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Logo />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Header success */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/10 to-violet-500/10 border-2 border-rose-500/50 mb-6">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            ¡Bienvenido al <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">Plan Premium</span>!
          </h1>
          <p className="text-xl text-gray-400">Tu pago fue confirmado. Ahora diseñamos tu invitación única</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-semibold mb-6">Completá estos datos para comenzar</h3>
          
          <div className="space-y-6">
            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                Tu WhatsApp <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                placeholder="+54 9 11 1234-5678"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Te contactaremos por este número</p>
            </div>

            {/* Tipo de evento */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                Tipo de evento <span className="text-rose-400">*</span>
              </label>
              <select
                id="eventType"
                required
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
              >
                <option value="">Seleccioná una opción</option>
                <option value="boda">Boda</option>
                <option value="xv">XV años</option>
                <option value="cumpleaños">Cumpleaños</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="aniversario">Aniversario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Fecha del evento */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                ¿Cuándo es el evento? <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                type="date"
                id="eventDate"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
              />
            </div>

            {/* Brief */}
            <div>
              <label htmlFor="briefMessage" className="block text-sm font-medium mb-2">
                Contanos tu visión <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="briefMessage"
                rows={4}
                placeholder="Ejemplo: Queremos algo elegante, colores pasteles, estilo minimalista..."
                value={formData.briefMessage}
                onChange={(e) => setFormData({ ...formData, briefMessage: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Colores, estilo, referencias que te gusten, etc.</p>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white py-4 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Enviando..." : "Enviar → Te contactamos en 24hs"}
          </button>
        </form>

        {/* Detalles del pago */}
        {payment && (
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Detalles del pago</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Plan:</span>
                <p className="font-semibold">Premium</p>
              </div>
              <div>
                <span className="text-gray-500">Monto:</span>
                <p className="font-semibold">${payment.amount.toLocaleString("es-AR")}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Email:</span>
                <p className="font-semibold">{payment.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logo para volver */}
        <div className="flex justify-center pt-6">
          <Logo />
        </div>
      </div>
    </main>
  );
}

export default function PremiumConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <PremiumConfirmedContent />
    </Suspense>
  );
}
