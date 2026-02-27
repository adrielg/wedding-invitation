"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PremiumConfirmedPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<any>(null);

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

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Header success */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/10 to-violet-500/10 border-2 border-rose-500/50 mb-6">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            ¡Pago <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">confirmado</span>!
          </h1>
          <p className="text-xl text-gray-400">Plan Premium activado correctamente</p>
        </div>

        {/* Card con información */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">¿Qué sigue ahora?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nuestro equipo te contactará en las próximas <strong className="text-white">24-48 horas</strong> por WhatsApp al número que registraste en MercadoPago para comenzar a diseñar tu evento personalizado.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <h4 className="font-semibold text-sm mb-1">Vamos a llamarte</h4>
                <p className="text-gray-500 text-sm">Te contactaremos para entender qué necesitás y cómo querés tu evento.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="font-semibold text-sm mb-1">Diseño personalizado</h4>
                <p className="text-gray-500 text-sm">Crearemos tu evento con diseño único adaptado a tu estilo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold text-sm mb-1">Recibís tu link</h4>
                <p className="text-gray-500 text-sm">Te enviamos el link de tu evento + contraseña para administrarlo cuando quieras.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA WhatsApp */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">¿Tenés dudas o querés arrancar ya?</h4>
              <p className="text-gray-400 text-sm mb-3">Escribinos y te respondemos al instante</p>
              <a
                href={`https://wa.me/5493434386611?text=Hola!%20Acabo%20de%20pagar%20el%20Plan%20Premium%20(ID:%20${paymentId})%20y%20quiero%20empezar%20a%20diseñar%20mi%20evento`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Detalles del pago */}
        {payment && (
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
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

        {/* Volver al inicio */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
