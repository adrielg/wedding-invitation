"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import EventPreview from "@/app/components/EventPreview";
import { EVENT_TYPES, TYPES_WITH_CEREMONY } from "@/lib/constants/event-types";

function CreateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const steps = [
    { id: 1, name: "Básico", icon: "📝" },
    { id: 2, name: "Lugar", icon: "📍" },
    { id: 3, name: "Diseño", icon: "🎨" },
    { id: 4, name: "Config", icon: "⚙️" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "wedding",
    date: "",
    location: "",
    description: "",
    password: "",
    requires_menu: true,
    requires_dietary: true,
    requires_allergies: true,
    max_adults: 10,
    max_children: 10,
    theme_primary_color: "#f43f5e",
    theme_secondary_color: "#fda4af",
    theme_background: "gradient",
    theme_font_family: "Playfair Display",
    hero_image_url: "",
    venue_name: "",
    venue_address: "",
    venue_map_url: "",
    ceremony_time: "",
    reception_time: "",
    parking_info: "",
    dress_code: "",
  });

  // Actualizar título y favicon
  useEffect(() => {
    document.title = "Crear Evento";
    
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>➕</text></svg>`;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generar slug desde el nombre
      if (name === "name") {
        const slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

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
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          date: new Date(formData.date).toISOString(),
          location: formData.location || null,
          description: formData.description || null,
          password: formData.password || null,
          paymentId,
          config: {
            requires_menu: formData.requires_menu,
            requires_dietary: formData.requires_dietary,
            requires_allergies: formData.requires_allergies,
            max_adults: formData.max_adults,
            max_children: formData.max_children,
            theme_primary_color: formData.theme_primary_color,
            theme_secondary_color: formData.theme_secondary_color,
            theme_background: formData.theme_background,
            theme_font_family: formData.theme_font_family,
            hero_image_url: formData.hero_image_url || null,
            venue_name: formData.venue_name || null,
            venue_address: formData.venue_address || null,
            venue_map_url: formData.venue_map_url || null,
            ceremony_time: formData.ceremony_time || null,
            reception_time: formData.reception_time || null,
            parking_info: formData.parking_info || null,
            dress_code: formData.dress_code || null,
          }
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
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando pago...</p>
        </div>
      </main>
    );
  }

  if (error && verifying) {
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
    <div className="flex min-h-screen bg-gray-950">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-400/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Formulario - Lado Izquierdo con scroll */}
      <div className={`relative overflow-y-auto transition-all ${fullscreenPreview ? 'hidden' : 'w-full lg:w-1/2'}`}>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header con pago aprobado */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-sm font-medium text-green-400">Pago aprobado</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      currentStep === step.id
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                        : currentStep > step.id
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                  </button>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-xs font-medium ${
                      currentStep === step.id ? 'text-rose-400' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-rose-500/30' : 'bg-gray-800/50'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Crear Tu Evento
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Paso {currentStep} de {steps.length} — {steps.find(s => s.id === currentStep)?.name}
            </p>

            {error && !verifying && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Información Básica */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Evento <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Boda de Juan y María"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL del Evento <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-lg focus-within:ring-2 focus-within:ring-rose-500 transition-all">
                      <span className="text-gray-500 pl-4">/e/</span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9-]+"
                        className="flex-1 px-2 py-3 bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none"
                        placeholder="boda-juan-maria"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Se genera automáticamente desde el nombre
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Evento <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-gray-900">{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha del Evento <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña de Acceso
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Opcional - para acceso al admin"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para que accedas a /e/[slug]/admin y veas tus confirmaciones
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Detalles del Lugar */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Lugar
                    </label>
                    <input
                      type="text"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Complejo Oscar Chapino"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="venue_address"
                      value={formData.venue_address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Av. Jorge Newbery 5000, Paraná, ER"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL del Mapa de Google
                    </label>
                    <input
                      type="url"
                      name="venue_map_url"
                      value={formData.venue_map_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Google Maps → Compartir → Insertar mapa → Copiar "src"
                    </p>
                  </div>

                  {TYPES_WITH_CEREMONY.includes(formData.type as any) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Hora de Ceremonia
                        </label>
                        <input
                          type="text"
                          name="ceremony_time"
                          value={formData.ceremony_time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="12:30 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Hora de Recepción
                        </label>
                        <input
                          type="text"
                          name="reception_time"
                          value={formData.reception_time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="13:30 PM"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Información de Estacionamiento
                    </label>
                    <textarea
                      name="parking_info"
                      value={formData.parking_info}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                      placeholder="Estacionamiento gratuito disponible"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código de Vestimenta
                    </label>
                    <input
                      type="text"
                      name="dress_code"
                      value={formData.dress_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Formal / Semi-formal / Casual elegante"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Personalización Visual */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Primario
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          name="theme_primary_color"
                          value={formData.theme_primary_color}
                          onChange={handleChange}
                          className="h-10 w-16 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.theme_primary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme_primary_color: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-rose-500"
                          placeholder="#f43f5e"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Secundario
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          name="theme_secondary_color"
                          value={formData.theme_secondary_color}
                          onChange={handleChange}
                          className="h-10 w-16 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.theme_secondary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme_secondary_color: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-rose-500"
                          placeholder="#fda4af"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estilo de Fondo
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'gradient', label: 'Degradado', icon: '🌈' },
                        { value: 'solid', label: 'Sólido', icon: '⬜' },
                        { value: 'pattern', label: 'Patrón', icon: '⚪' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, theme_background: option.value }))}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            formData.theme_background === option.value
                              ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                              : 'border-gray-700/50 bg-gray-800/30 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{option.icon}</span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipografía
                    </label>
                    <select
                      name="theme_font_family"
                      value={formData.theme_font_family}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    >
                      <option value="Playfair Display" className="bg-gray-900">Playfair Display (Elegante)</option>
                      <option value="Montserrat" className="bg-gray-900">Montserrat (Moderna)</option>
                      <option value="Dancing Script" className="bg-gray-900">Dancing Script (Cursiva)</option>
                      <option value="Roboto" className="bg-gray-900">Roboto (Limpia)</option>
                      <option value="Great Vibes" className="bg-gray-900">Great Vibes (Manuscrita)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imagen de Portada
                    </label>
                    <input
                      type="url"
                      name="hero_image_url"
                      value={formData.hero_image_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fuentes: <a href="https://unsplash.com" target="_blank" className="text-rose-400 hover:underline">Unsplash</a>, <a href="https://pexels.com" target="_blank" className="text-rose-400 hover:underline">Pexels</a>
                    </p>
                    {formData.hero_image_url && (
                      <div className="mt-3">
                        <img 
                          src={formData.hero_image_url} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%23d1d5db" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Live Preview Card */}
                  <div className="p-4 border border-gray-700/50 rounded-lg bg-gray-800/30">
                    <p className="text-xs text-gray-400 mb-3">Vista previa del tema:</p>
                    <div 
                      className="p-6 rounded-lg"
                      style={{
                        backgroundColor: formData.theme_background === 'solid' 
                          ? formData.theme_primary_color
                          : formData.theme_background === 'pattern'
                          ? formData.theme_primary_color
                          : undefined,
                        backgroundImage: formData.theme_background === 'gradient'
                          ? `linear-gradient(135deg, ${formData.theme_primary_color}, ${formData.theme_secondary_color})`
                          : formData.theme_background === 'pattern'
                          ? 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)'
                          : undefined,
                        backgroundSize: formData.theme_background === 'pattern' ? '20px 20px' : undefined,
                      }}
                    >
                      <h3 
                        className="text-2xl font-bold text-white mb-2"
                        style={{ fontFamily: formData.theme_font_family }}
                      >
                        {formData.name || 'Nombre del Evento'}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {formData.date ? new Date(formData.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Fecha del evento'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Configuración RSVP */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <label className="flex items-start p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-all group">
                      <input
                        type="checkbox"
                        name="requires_menu"
                        checked={formData.requires_menu}
                        onChange={handleChange}
                        className="h-5 w-5 text-rose-500 focus:ring-rose-500 border-gray-600 rounded mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white">
                          Solicitar selección de menú
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Los invitados elegirán entre opciones de platos
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-all group">
                      <input
                        type="checkbox"
                        name="requires_dietary"
                        checked={formData.requires_dietary}
                        onChange={handleChange}
                        className="h-5 w-5 text-rose-500 focus:ring-rose-500 border-gray-600 rounded mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white">
                          Solicitar restricciones dietéticas
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Vegetariano, vegano, celíaco, etc.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-all group">
                      <input
                        type="checkbox"
                        name="requires_allergies"
                        checked={formData.requires_allergies}
                        onChange={handleChange}
                        className="h-5 w-5 text-rose-500 focus:ring-rose-500 border-gray-600 rounded mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white">
                          Solicitar información de alergias
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Alergias alimentarias o intolerancias
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máx. adultos
                      </label>
                      <input
                        type="number"
                        name="max_adults"
                        value={formData.max_adults}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máx. niños
                      </label>
                      <input
                        type="number"
                        name="max_children"
                        value={formData.max_children}
                        onChange={handleChange}
                        min="0"
                        max="20"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-800/50">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Anterior
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all inline-flex items-center gap-2 group shadow-lg shadow-rose-500/20"
                  >
                    Siguiente
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 shadow-lg shadow-rose-500/20"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Crear Evento
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Preview - Lado Derecho fijo */}
      <div className={`relative lg:h-screen lg:sticky lg:top-0 transition-all ${fullscreenPreview ? 'w-full' : 'hidden lg:block lg:w-1/2'}`}>
        {/* Preview Controls */}
        <div className="absolute top-4 left-4 z-40 text-white/80 text-xs font-medium backdrop-blur-sm bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
          Preview
        </div>
        
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            type="button"
            onClick={() => setFullscreenPreview(!fullscreenPreview)}
            className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-2.5 text-white hover:bg-gray-800 transition-colors shadow-lg"
            title={fullscreenPreview ? "Vista dividida" : "Pantalla completa"}
          >
            {fullscreenPreview ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="h-full overflow-y-auto bg-gray-900 border-l border-gray-800">
          <EventPreview
            name={formData.name}
            type={formData.type as any}
            date={formData.date.split('T')[0]}
            location={formData.venue_address}
            description=""
            venueAddress={formData.venue_address}
            venueName={formData.venue_name}
            venueMapUrl={formData.venue_map_url}
            ceremonyTime={formData.ceremony_time}
            receptionTime={formData.reception_time}
            parkingInfo={formData.parking_info}
            dressCode={formData.dress_code}
            heroImageUrl={formData.hero_image_url}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <CreateEventForm />
    </Suspense>
  );
}

