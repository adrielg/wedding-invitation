"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import EventPreview from "@/app/components/EventPreview";
import { EVENT_TYPES, TYPES_WITH_CEREMONY } from "@/lib/constants/event-types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Error al cargar evento');
        
        const event = await response.json();
        
        // Convertir fecha ISO a formato datetime-local
        const dateObj = new Date(event.date);
        const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setFormData({
          name: event.name,
          slug: event.slug,
          type: event.type,
          date: localDate,
          location: event.location || "",
          description: event.description || "",
          password: "", // No mostramos la contraseña actual por seguridad
          requires_menu: event.config?.requires_menu ?? true,
          requires_dietary: event.config?.requires_dietary ?? true,
          requires_allergies: event.config?.requires_allergies ?? true,
          max_adults: event.config?.max_adults ?? 10,
          max_children: event.config?.max_children ?? 10,
          theme_primary_color: event.config?.theme_primary_color || "#f43f5e",
          theme_secondary_color: event.config?.theme_secondary_color || "#fda4af",
          theme_background: event.config?.theme_background || "gradient",
          theme_font_family: event.config?.theme_font_family || "Playfair Display",
          hero_image_url: event.config?.hero_image_url || "",
          venue_name: event.config?.venue_name || "",
          venue_address: event.config?.venue_address || "",
          venue_map_url: event.config?.venue_map_url || "",
          ceremony_time: event.config?.ceremony_time || "",
          reception_time: event.config?.reception_time || "",
          parking_info: event.config?.parking_info || "",
          dress_code: event.config?.dress_code || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoadingData(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          date: new Date(formData.date).toISOString(),
          location: formData.location || null,
          description: formData.description || null,
          ...(formData.password ? { password: formData.password } : {}),
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
        throw new Error(data.error || 'Error al actualizar evento');
      }

      router.push(`/admin/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando evento...</p>
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
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/admin/dashboard"
              className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-2 text-sm group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Volver al Dashboard
            </Link>
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
              Editar Evento
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Paso {currentStep} de {steps.length} — {steps.find(s => s.id === currentStep)?.name}
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Información Básica */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Evento *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Ej: Boda de Juan y María"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL del Evento (slug) *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">/e/</span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9-]+"
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                        placeholder="boda-juan-maria"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Solo letras minúsculas, números y guiones. Ej: boda-juan-maria-2025
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Evento *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-gray-900">
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha y Hora del Evento *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña del Evento
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Dejar en blanco para mantener la actual"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Solo completa este campo si deseas cambiar la contraseña
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Lugar y Detalles */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Lugar
                    </label>
                    <input
                      type="text"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Ej: Complejo Oscar Chapino"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dirección del Lugar
                    </label>
                    <input
                      type="text"
                      name="venue_address"
                      value={formData.venue_address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Ej: Av. Jorge Newbery 5000, Paraná, ER"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL del Mapa (Google Maps iframe src)
                    </label>
                    <input
                      type="url"
                      name="venue_map_url"
                      value={formData.venue_map_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      En Google Maps: Compartir → Insertar un mapa → Copiar el "src" del iframe
                    </p>
                  </div>

                  {TYPES_WITH_CEREMONY.includes(formData.type) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Hora de Ceremonia
                        </label>
                        <input
                          type="text"
                          name="ceremony_time"
                          value={formData.ceremony_time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                          placeholder="Ej: 12:30 PM"
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
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                          placeholder="Ej: 13:30 PM"
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
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all resize-none"
                      placeholder="Ej: Estacionamiento gratuito disponible en el lugar"
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
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="Ej: Formal / Semi-formal / Casual elegante"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Diseño y Personalización */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Primario
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="theme_primary_color"
                          value={formData.theme_primary_color}
                          onChange={handleChange}
                          className="h-12 w-20 bg-gray-800/50 border border-gray-700/50 rounded-xl cursor-pointer transition-all hover:border-rose-500/50"
                        />
                        <input
                          type="text"
                          value={formData.theme_primary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme_primary_color: e.target.value }))}
                          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-sm transition-all"
                          placeholder="#f43f5e"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Secundario
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="theme_secondary_color"
                          value={formData.theme_secondary_color}
                          onChange={handleChange}
                          className="h-12 w-20 bg-gray-800/50 border border-gray-700/50 rounded-xl cursor-pointer transition-all hover:border-rose-500/50"
                        />
                        <input
                          type="text"
                          value={formData.theme_secondary_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme_secondary_color: e.target.value }))}
                          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white text-sm transition-all"
                          placeholder="#fda4af"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estilo de Fondo
                    </label>
                    <select
                      name="theme_background"
                      value={formData.theme_background}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
                    >
                      <option value="gradient" className="bg-gray-900">Degradado de colores</option>
                      <option value="solid" className="bg-gray-900">Color sólido</option>
                      <option value="pattern" className="bg-gray-900">Patrón de puntos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipografía
                    </label>
                    <select
                      name="theme_font_family"
                      value={formData.theme_font_family}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
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
                      Imagen de Portada (URL)
                    </label>
                    <input
                      type="url"
                      name="hero_image_url"
                      value={formData.hero_image_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white placeholder-gray-500 transition-all"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Recomendado: imagen horizontal 1920x1080px. Fuentes: <a href="https://unsplash.com" target="_blank" className="text-rose-400 hover:text-rose-300 transition-colors">Unsplash</a>, <a href="https://pexels.com" target="_blank" className="text-rose-400 hover:text-rose-300 transition-colors">Pexels</a>
                    </p>
                    {formData.hero_image_url && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-gray-700/50">
                        <img 
                          src={formData.hero_image_url} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError de carga%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Live Preview Card */}
                  <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/30 rounded-xl p-6">
                    <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Vista previa en vivo</p>
                    <div 
                      className="rounded-xl p-8 shadow-xl transition-all duration-300"
                      style={{
                        backgroundColor: formData.theme_background === 'solid' 
                          ? formData.theme_primary_color
                          : formData.theme_background === 'pattern'
                          ? formData.theme_primary_color
                          : undefined,
                        backgroundImage: formData.theme_background === 'gradient'
                          ? `linear-gradient(135deg, ${formData.theme_primary_color}, ${formData.theme_secondary_color})`
                          : formData.theme_background === 'pattern'
                          ? 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)'
                          : undefined,
                        backgroundSize: formData.theme_background === 'pattern' ? '20px 20px' : undefined,
                      }}
                    >
                      <h3 
                        className="text-3xl font-bold text-white mb-3 drop-shadow-lg"
                        style={{ fontFamily: formData.theme_font_family }}
                      >
                        {formData.name || 'Nombre del Evento'}
                      </h3>
                      <p className="text-white/90 text-lg drop-shadow">
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
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-rose-500/30 transition-all cursor-pointer">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="requires_menu"
                          checked={formData.requires_menu}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-600 rounded bg-gray-800/50"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">Solicitar selección de menú</div>
                          <div className="text-xs text-gray-400 mt-1">Los invitados podrán elegir su menú preferido</div>
                        </div>
                      </label>
                    </div>

                    <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-rose-500/30 transition-all cursor-pointer">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="requires_dietary"
                          checked={formData.requires_dietary}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-600 rounded bg-gray-800/50"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">Solicitar restricciones dietéticas</div>
                          <div className="text-xs text-gray-400 mt-1">Ej: vegetariano, vegano, sin gluten, etc.</div>
                        </div>
                      </label>
                    </div>

                    <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-rose-500/30 transition-all cursor-pointer">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="requires_allergies"
                          checked={formData.requires_allergies}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-600 rounded bg-gray-800/50"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">Solicitar información de alergias</div>
                          <div className="text-xs text-gray-400 mt-1">Para cuidar la salud de todos los invitados</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máximo de adultos por confirmación
                      </label>
                      <input
                        type="number"
                        name="max_adults"
                        value={formData.max_adults}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máximo de niños por confirmación
                      </label>
                      <input
                        type="number"
                        name="max_children"
                        value={formData.max_children}
                        onChange={handleChange}
                        min="0"
                        max="20"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                  )}
                  <Link
                    href="/admin/dashboard"
                    className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
                  >
                    Cancelar
                  </Link>
                </div>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-xl hover:from-rose-500 hover:to-rose-400 transition-all duration-200 shadow-lg shadow-rose-500/25 flex items-center gap-2 group"
                  >
                    Siguiente
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-xl hover:from-rose-500 hover:to-rose-400 transition-all duration-200 shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Preview Sidebar - Right side */}
      <div className={`relative overflow-y-auto transition-all ${fullscreenPreview ? 'w-full' : 'hidden lg:block lg:w-1/2'}`}>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="sticky top-24">
              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setFullscreenPreview(!fullscreenPreview)}
                className="w-full mb-4 px-4 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-rose-500/50 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {fullscreenPreview ? (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cerrar vista previa
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Vista previa completa
                  </>
                )}
              </button>

              {/* Preview Card */}
              <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Vista Previa</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-500">En vivo</span>
                  </div>
                </div>
                
                <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  <EventPreview 
                    eventData={{
                      name: formData.name || 'Nombre del Evento',
                      type: formData.type,
                      date: formData.date,
                      venue_name: formData.venue_name,
                      venue_address: formData.venue_address,
                      venue_map_url: formData.venue_map_url,
                      ceremony_time: formData.ceremony_time,
                      reception_time: formData.reception_time,
                      theme_primary_color: formData.theme_primary_color,
                      theme_secondary_color: formData.theme_secondary_color,
                      theme_background: formData.theme_background,
                      theme_font_family: formData.theme_font_family,
                      hero_image_url: formData.hero_image_url,
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {fullscreenPreview && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/50 border-b border-gray-800/50 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <h3 className="text-lg font-medium text-white">Vista Previa Completa</h3>
                  <button
                    onClick={() => setFullscreenPreview(false)}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cerrar
                  </button>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto py-8 px-4">
                <EventPreview 
                  eventData={{
                    name: formData.name || 'Nombre del Evento',
                    type: formData.type,
                    date: formData.date,
                    venue_name: formData.venue_name,
                    venue_address: formData.venue_address,
                    venue_map_url: formData.venue_map_url,
                    ceremony_time: formData.ceremony_time,
                    reception_time: formData.reception_time,
                    theme_primary_color: formData.theme_primary_color,
                    theme_secondary_color: formData.theme_secondary_color,
                    theme_background: formData.theme_background,
                    theme_font_family: formData.theme_font_family,
                    hero_image_url: formData.hero_image_url,
                  }} 
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
