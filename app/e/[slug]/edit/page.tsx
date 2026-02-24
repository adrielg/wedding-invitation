"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ClientEditEventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    password: "",
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
    const checkAuthAndFetchEvent = async () => {
      try {
        // Verificar token de cliente
        const token = localStorage.getItem(`event_auth_${slug}`);
        if (!token) {
          router.push(`/e/${slug}/admin-login`);
          return;
        }

        // Obtener datos del evento
        const response = await fetch(`/api/events/by-slug/${slug}`);
        if (!response.ok) throw new Error('Error al cargar evento');
        
        const event = await response.json();
        setEventId(event.id);
        
        // Convertir fecha ISO a formato datetime-local
        const dateObj = new Date(event.date);
        const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setFormData({
          name: event.name,
          date: localDate,
          location: event.location || "",
          description: event.description || "",
          password: "",
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

    checkAuthAndFetchEvent();
  }, [slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir fecha de datetime-local a ISO
      const dateObj = new Date(formData.date);
      const isoDate = dateObj.toISOString();

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          date: isoDate,
          location: formData.location || null,
          description: formData.description || null,
          password: formData.password || undefined,
          config: {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar evento');
      }

      router.push(`/e/${slug}/admin`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <main className="p-10">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Editar Evento
          </h1>
          <p className="text-gray-600">
            Personaliza los detalles de tu evento
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Boda de Juan y María"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción breve del evento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dejar en blanco para mantener la actual"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo completa si quieres cambiar la contraseña de acceso
                </p>
              </div>
            </div>
          </div>

          {/* Detalles del Lugar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Detalles del Lugar
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Salón Los Jardines"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Calle 123, Ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Google Maps (iframe)
                </label>
                <input
                  type="text"
                  name="venue_map_url"
                  value={formData.venue_map_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Ceremonia
                  </label>
                  <input
                    type="time"
                    name="ceremony_time"
                    value={formData.ceremony_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Recepción
                  </label>
                  <input
                    type="time"
                    name="reception_time"
                    value={formData.reception_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Formal, Elegante Sport"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información de Estacionamiento
                </label>
                <textarea
                  name="parking_info"
                  value={formData.parking_info}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detalles sobre estacionamiento..."
                />
              </div>
            </div>
          </div>

          {/* Personalización Visual */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pegá la URL de una imagen. Recomendado: horizontal (1920x1080px). Se adapta automáticamente a móvil y desktop.
                  <br />
                  Fuentes sugeridas: <a href="https://unsplash.com/s/photos/wedding" target="_blank" className="text-blue-600 hover:underline">Unsplash</a>, <a href="https://www.pexels.com/search/wedding/" target="_blank" className="text-blue-600 hover:underline">Pexels</a>
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
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/e/${slug}/admin`)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
