"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EVENT_TYPES, TYPES_WITH_CEREMONY } from "@/lib/constants/event-types";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
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
          password: formData.password || null,
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
        throw new Error(data.error || 'Error al crear evento');
      }

      const event = await response.json();
      router.push(`/admin/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/dashboard"
            className="text-rose-600 hover:text-rose-700"
          >
            ← Volver al Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Crear Nuevo Evento
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Información Básica
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Boda de Juan y María"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Evento (slug) *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/e/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      pattern="[a-z0-9-]+"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="boda-juan-maria"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras minúsculas, números y guiones. Se genera automáticamente.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    El tipo determina qué campos se mostrarán en el formulario de confirmación
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña de Acceso para el Cliente
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Contraseña para que el cliente vea sus confirmaciones"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El cliente usará esta contraseña para acceder a /e/[slug]/admin y ver sus confirmaciones
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles del Evento */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Detalles del Evento
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Lugar
                  </label>
                  <input
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Complejo Oscar Chapino"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="venue_address"
                    value={formData.venue_address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Av. Jorge Newbery 5000, Paraná, ER"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Mapa de Google (iframe src)
                  </label>
                  <input
                    type="url"
                    name="venue_map_url"
                    value={formData.venue_map_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ve a Google Maps, busca el lugar, click "Compartir" → "Insertar un mapa" → Copia el "src" del iframe
                  </p>
                </div>

                {TYPES_WITH_CEREMONY.includes(formData.type as any) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Ceremonia
                      </label>
                      <input
                        type="text"
                        name="ceremony_time"
                        value={formData.ceremony_time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="12:30 PM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Recepción
                      </label>
                      <input
                        type="text"
                        name="reception_time"
                        value={formData.reception_time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="13:30 PM"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información de Estacionamiento
                  </label>
                  <textarea
                    name="parking_info"
                    value={formData.parking_info}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Estacionamiento gratuito disponible en el lugar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Vestimenta
                  </label>
                  <input
                    type="text"
                    name="dress_code"
                    value={formData.dress_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Formal / Semi-formal / Casual elegante"
                  />
                </div>
              </div>
            </div>

            {/* Configuración de Tema */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Personalización Visual
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Primario
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="theme_primary_color"
                        value={formData.theme_primary_color}
                        onChange={handleChange}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.theme_primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, theme_primary_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="#f43f5e"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Secundario
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="theme_secondary_color"
                        value={formData.theme_secondary_color}
                        onChange={handleChange}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.theme_secondary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, theme_secondary_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="#fda4af"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estilo de Fondo
                  </label>
                  <select
                    name="theme_background"
                    value={formData.theme_background}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="gradient">Degradado de colores</option>
                    <option value="solid">Color sólido</option>
                    <option value="pattern">Patrón de puntos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipografía
                  </label>
                  <select
                    name="theme_font_family"
                    value={formData.theme_font_family}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="Playfair Display">Playfair Display (Elegante)</option>
                    <option value="Montserrat">Montserrat (Moderna)</option>
                    <option value="Dancing Script">Dancing Script (Cursiva)</option>
                    <option value="Roboto">Roboto (Limpia)</option>
                    <option value="Great Vibes">Great Vibes (Manuscrita)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    La tipografía se aplicará a títulos y encabezados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de Portada (URL)
                  </label>
                  <input
                    type="url"
                    name="hero_image_url"
                    value={formData.hero_image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pegá la URL de una imagen. Recomendado: horizontal (1920x1080px). Se adapta automáticamente a móvil y desktop.
                    <br />
                    Fuentes sugeridas: <a href="https://unsplash.com/s/photos/wedding" target="_blank" className="text-rose-600 hover:underline">Unsplash</a>, <a href="https://www.pexels.com/search/wedding/" target="_blank" className="text-rose-600 hover:underline">Pexels</a>
                  </p>
                  {formData.hero_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.hero_image_url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Preview */}
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
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
                    <p className="text-white/90">
                      {formData.date ? new Date(formData.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Fecha del evento'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración del Formulario */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Configuración del Formulario RSVP
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requires_menu"
                    checked={formData.requires_menu}
                    onChange={handleChange}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Solicitar selección de menú
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requires_dietary"
                    checked={formData.requires_dietary}
                    onChange={handleChange}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Solicitar restricciones dietéticas
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requires_allergies"
                    checked={formData.requires_allergies}
                    onChange={handleChange}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Solicitar información de alergias
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de adultos por confirmación
                    </label>
                    <input
                      type="number"
                      name="max_adults"
                      value={formData.max_adults}
                      onChange={handleChange}
                      min="1"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de niños por confirmación
                    </label>
                    <input
                      type="number"
                      name="max_children"
                      value={formData.max_children}
                      onChange={handleChange}
                      min="0"
                      max="20"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Evento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
