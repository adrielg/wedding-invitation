"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Rsvp {
  id: string;
  nombre: string;
  apellido: string;
  asistencia: string;
  menores_cinco: number;
  entre_cinco_diez: number;
  mayores_diez: number;
  restricciones_alimentarias: string | null;
  mensaje: string | null;
  created_at: string;
}

interface Event {
  id: string;
  name: string;
  slug: string;
}

export default function EventRsvpsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Actualizar título y favicon cuando se carga el evento
  useEffect(() => {
    if (event) {
      document.title = `RSVPs - ${event.name}`;
      
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      faviconLink.type = 'image/svg+xml';
      faviconLink.rel = 'icon';
      faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>`;
      
      if (!document.querySelector("link[rel*='icon']")) {
        document.head.appendChild(faviconLink);
      }
    }
  }, [event]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar autenticación
        const authResponse = await fetch("/api/check-auth");
        if (!authResponse.ok) {
          router.push("/admin-login");
          return;
        }

        // Obtener datos del evento
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEvent(eventData);
        }

        // Obtener RSVPs del evento
        const rsvpsResponse = await fetch(`/api/events/${eventId}/rsvps`);
        if (!rsvpsResponse.ok) {
          throw new Error('Error al obtener confirmaciones');
        }
        
        const rsvpsData = await rsvpsResponse.json();
        setRsvps(rsvpsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [eventId, router]);

  const exportToExcel = async () => {
    if (!rsvps || rsvps.length === 0) return;

    const XLSX = await import("xlsx");

    const rows = rsvps.map((rsvp) => ({
      Nombre: rsvp.nombre,
      Apellido: rsvp.apellido,
      Asiste:
        rsvp.asistencia === "si"
          ? "Sí"
          : rsvp.asistencia === "no"
          ? "No"
          : "Quizás",
      "Menores a 5 años": rsvp.menores_cinco,
      "Entre 5 y 10 años": rsvp.entre_cinco_diez,
      "Mayores a 10 años": rsvp.mayores_diez,
      "Restricciones alimentarias": rsvp.restricciones_alimentarias ?? "",
      Comentario: rsvp.mensaje ?? "",
      "Fecha creación": new Date(rsvp.created_at).toLocaleString("es-AR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVP");
    XLSX.writeFile(workbook, `confirmaciones-${event?.slug || 'evento'}.xlsx`);
  };

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter(r => r.asistencia === 'si').length,
    declined: rsvps.filter(r => r.asistencia === 'no').length,
    pending: rsvps.filter(r => r.asistencia === 'quizas').length,
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
        <div className="mb-6">
          <Link 
            href="/admin/dashboard"
            className="text-rose-600 hover:text-rose-700"
          >
            ← Volver al Dashboard
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Confirmaciones - {event?.name || 'Evento'}
            </h1>
            {event && (
              <p className="text-gray-600 mt-2">
                <Link 
                  href={`/e/${event.slug}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Ver página pública →
                </Link>
              </p>
            )}
          </div>
          
          <button
            onClick={exportToExcel}
            disabled={rsvps.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exportar a Excel
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <p className="text-green-600 text-sm">Confirmados</p>
            <p className="text-3xl font-bold text-green-800">{stats.confirmed}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <p className="text-red-600 text-sm">No asisten</p>
            <p className="text-3xl font-bold text-red-800">{stats.declined}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <p className="text-yellow-600 text-sm">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
          </div>
        </div>

        {/* Tabla de RSVPs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {rsvps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay confirmaciones aún</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {rsvp.nombre} {rsvp.apellido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rsvp.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      rsvp.asistencia === 'si' ? 'bg-green-100 text-green-800' :
                      rsvp.asistencia === 'no' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rsvp.asistencia === "si" ? "Confirma" : rsvp.asistencia === "no" ? "No asiste" : "Tal vez"}
                    </span>
                  </div>

                  {rsvp.asistencia === 'si' && (
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Menores de 5</p>
                        <p className="font-semibold">{rsvp.menores_cinco}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Entre 5 y 10</p>
                        <p className="font-semibold">{rsvp.entre_cinco_diez}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mayores de 10</p>
                        <p className="font-semibold">{rsvp.mayores_diez}</p>
                      </div>
                    </div>
                  )}

                  {rsvp.restricciones_alimentarias && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Restricciones alimentarias:</p>
                      <p className="text-sm text-gray-800">{rsvp.restricciones_alimentarias}</p>
                    </div>
                  )}

                  {rsvp.mensaje && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Mensaje:</p>
                      <p className="text-sm text-gray-800">{rsvp.mensaje}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
