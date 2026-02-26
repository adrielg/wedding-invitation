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
  date: string;
  type: string;
}

export default function EventAdminPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar token
        const token = localStorage.getItem(`event_auth_${slug}`);
        if (!token) {
          router.replace(`/e/${slug}/admin-login`);
          return;
        }

        setAuthenticated(true);

        // Obtener datos del evento
        const eventResponse = await fetch(`/api/events/by-slug/${slug}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEvent(eventData);
          
          document.title = `Panel - ${eventData.name}`;
          
          const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
          faviconLink.type = 'image/svg+xml';
          faviconLink.rel = 'icon';
          faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>`;
          
          if (!document.querySelector("link[rel*='icon']")) {
            document.head.appendChild(faviconLink);
          }
        }

        // Obtener RSVPs del evento
        const rsvpsResponse = await fetch(`/api/events/by-slug/${slug}/rsvps`);
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
  }, [slug, router]);

  const handleLogout = () => {
    localStorage.removeItem(`event_auth_${slug}`);
    router.push(`/e/${slug}`);
  };

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
    confirmados: rsvps.filter(r => r.asistencia === 'si').length,
    noAsisten: rsvps.filter(r => r.asistencia === 'no').length,
    pendientes: rsvps.filter(r => r.asistencia === 'quizas').length,
    totalPersonas: rsvps.reduce((sum, r) => {
      if (r.asistencia === 'si') {
        return sum + 1 + r.menores_cinco + r.entre_cinco_diez + r.mayores_diez;
      }
      return sum;
    }, 0)
  };

  if (loading || !authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Verificando acceso...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Panel de {event?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona las confirmaciones de asistencia a tu evento
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/e/${slug}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              ✏️ Editar Evento
            </Link>
            <Link
              href={`/e/${slug}`}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Ver Evento
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Total Respuestas</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Confirmados</p>
            <p className="text-3xl font-bold text-green-700">{stats.confirmados}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">No Asisten</p>
            <p className="text-3xl font-bold text-red-700">{stats.noAsisten}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.pendientes}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Personas</p>
            <p className="text-3xl font-bold text-blue-700">{stats.totalPersonas}</p>
          </div>
        </div>

        {/* Botón de exportar */}
        <div className="mb-6">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
          >
            📥 Descargar Excel
          </button>
        </div>

        {/* Tabla de RSVPs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Asistencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acompañantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Restricciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rsvp.nombre} {rsvp.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rsvp.asistencia === 'si' 
                        ? 'bg-green-100 text-green-800'
                        : rsvp.asistencia === 'no'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rsvp.asistencia === 'si' ? 'Confirma' : rsvp.asistencia === 'no' ? 'No asiste' : 'Quizás'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rsvp.asistencia === 'si' && (
                      <span>
                        {rsvp.menores_cinco + rsvp.entre_cinco_diez + rsvp.mayores_diez > 0
                          ? `+${rsvp.menores_cinco + rsvp.entre_cinco_diez + rsvp.mayores_diez}`
                          : 'Sin acompañantes'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {rsvp.restricciones_alimentarias || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rsvp.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {rsvps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay confirmaciones aún</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
