"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function EventAdminLoginPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    document.title = "Acceso - Panel del Evento";
    
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>`;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }

    // Obtener nombre del evento
    const fetchEventName = async () => {
      try {
        const response = await fetch(`/api/events/by-slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setEventName(data.name);
        }
      } catch (err) {
        console.error("Error al cargar evento:", err);
      }
    };

    fetchEventName();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/by-slug/${slug}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Contraseña incorrecta');
      }

      const { token } = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem(`event_auth_${slug}`, token);
      
      // Redirigir al panel del evento
      router.push(`/e/${slug}/admin`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel del Evento
          </h1>
          {eventName && (
            <p className="text-lg text-gray-600">{eventName}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña de Acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
            />
            <p className="text-xs text-gray-500 mt-2">
              Esta contraseña te fue proporcionada para gestionar las confirmaciones de tu evento
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Acceder al Panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href={`/e/${slug}`}
            className="text-rose-600 hover:text-rose-700 text-sm"
          >
            ← Volver al evento
          </a>
        </div>
      </motion.div>
    </main>
  );
}
