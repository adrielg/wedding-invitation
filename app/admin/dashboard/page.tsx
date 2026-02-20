"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignOutButton from "../../components/SignOutButton";

interface Event {
  id: string;
  slug: string;
  name: string;
  type: string;
  date: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Actualizar título y favicon del dashboard
  useEffect(() => {
    document.title = "Panel de Eventos";
    
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>`;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
  }, []);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar autenticación
        const authResponse = await fetch("/api/check-auth");
        if (!authResponse.ok) {
          router.push("/admin-login");
          return;
        }

        // Obtener eventos
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Error al obtener eventos');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleDelete = async (eventId: string, eventName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el evento "${eventName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evento');
      }

      // Actualizar la lista de eventos
      setEvents(events.filter(e => e.id !== eventId));
      alert('Evento eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el evento');
    }
  };

  const handleToggleActive = async (eventId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      // Actualizar la lista de eventos
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, is_active: !currentStatus } : e
      ));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado del evento');
    }
  };

  const getEventTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      wedding: 'Casamiento',
      quince: '15 Años',
      'cumpleanos-adulto': 'Cumpleaños Adulto',
      'evento-infantil': 'Evento Infantil',
      babyshower: 'Baby Shower',
      corporativo: 'Corporativo',
      'celebracion-familiar': 'Celebración Familiar',
      otro: 'Otro'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <main className="p-10">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Panel de Eventos
          </h1>
          <SignOutButton />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total de eventos</p>
              <p className="text-3xl font-bold text-gray-800">{events.length}</p>
            </div>
            <Link
              href="/admin/events/create"
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition"
            >
              + Crear Nuevo Evento
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getEventTypeLabel(event.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    /e/{event.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(event.id, event.is_active)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                        event.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {event.is_active ? '✓ Activo' : '✗ Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/e/${event.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/rsvps`}
                      className="text-green-600 hover:text-green-900"
                    >
                      RSVPs
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, event.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay eventos creados aún</p>
              <Link
                href="/admin/events/create"
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                Crear tu primer evento →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
