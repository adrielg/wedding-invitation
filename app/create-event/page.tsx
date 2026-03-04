"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import EventPreview from "@/app/components/EventPreview";

type EventType = "wedding" | "fifteen" | "adult_birthday" | "childrens_event" | "babyshower" | "corporate";

const EVENT_TYPES = [
  { value: "wedding", label: "Casamiento", emoji: "💍" },
  { value: "fifteen", label: "XV Años", emoji: "👑" },
  { value: "adult_birthday", label: "Cumpleaños Adulto", emoji: "🎂" },
  { value: "childrens_event", label: "Evento Infantil", emoji: "🎈" },
  { value: "babyshower", label: "Baby Shower", emoji: "🍼" },
  { value: "corporate", label: "Evento Corporativo", emoji: "🏢" },
];

function CreateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "wedding" as EventType,
    date: "",
    location: "",
    description: "",
  });

  // Verificar pago al cargar
  useEffect(() => {
    if (!paymentId) {
      setError("No se encontró información de pago");
      setVerifying(false);
      return;
    }

    fetch(`/api/payments/verify?payment_id=${paymentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }

        const { payment } = data;

        if (payment.status !== "approved") {
          setError("El pago aún no fue aprobado");
          return;
        }

        if (payment.plan !== "standard") {
          setError("Este link es solo para el Plan Standard");
          return;
        }

        if (payment.hasEvent) {
          setError("Este pago ya fue utilizado para crear un evento");
          return;
        }

        setLoading(false);
      })
      .catch(() => setError("Error al verificar el pago"))
      .finally(() => setVerifying(false));
  }, [paymentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear evento");
      }

      const { event, password } = await response.json();

      // Redirigir al dashboard del evento con la contraseña
      router.push(`/e/${event.slug}/admin?password=${password}&new=true`);
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
    }
  };

  if (verifying) {
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
    <main className="min-h-screen bg-gray-950 text-white flex flex-col lg:flex-row">
      {/* Background (solo visible en formulario) */}
      <div className="fixed inset-0 pointer-events-none lg:w-1/2">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Formulario */}
      <div className={`relative z-10 w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto ${showPreview ? 'hidden lg:block' : 'block'}`}>
        <div className="max-w-2xl mx-auto px-6 py-8 lg:py-16">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              
              {/* Mobile Preview Toggle */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Ver Preview
              </button>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              ¡Pago <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">aprobado</span>!
            </h1>
            <p className="text-gray-400">Completá los datos para crear tu evento</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 lg:p-8 space-y-6">
          {/* Nombre del evento */}
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del evento *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Boda de Juan y María"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Tipo de evento */}
          <div>
            <label className="block text-sm font-medium mb-3">Tipo de evento *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as EventType })}
                  className={`p-4 rounded-xl border transition-all ${
                    formData.type === type.value
                      ? "bg-blue-500/10 border-blue-500 text-white"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.emoji}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-2">Fecha del evento *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Lugar */}
          <div>
            <label className="block text-sm font-medium mb-2">Lugar (opcional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Salón Los Rosales, Buenos Aires"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mensaje especial para tus invitados..."
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creando evento..." : "Crear mi evento"}
          </button>
        </form>
        </div>
      </div>

      {/* Preview - Desktop: lado derecho, Mobile: pantalla completa */}
      <div className={`w-full lg:w-1/2 lg:h-screen lg:border-l lg:border-gray-800 ${showPreview ? 'block' : 'hidden lg:block'}`}>
        {/* Mobile: botón volver */}
        <div className="lg:hidden sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al formulario
          </button>
        </div>
        
        <EventPreview
          name={formData.name}
          type={formData.type}
          date={formData.date}
          location={formData.location}
          description={formData.description}
        />
      </div>
    </main>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CreateEventForm />
    </Suspense>
  );
}
