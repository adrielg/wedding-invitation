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
        const token = localStorage.getItem(`event_auth_${slug}`);
        if (!token) {
          router.replace(`/e/${slug}/admin-login`);
          return;
        }

        setAuthenticated(true);

        const eventResponse = await fetch(`/api/events/by-slug/${slug}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEvent(eventData);

          document.title = `Panel - ${eventData.name}`;

          const faviconLink =
            (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
            document.createElement("link");
          faviconLink.type = "image/svg+xml";
          faviconLink.rel = "icon";
          faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>`;

          if (!document.querySelector("link[rel*='icon']")) {
            document.head.appendChild(faviconLink);
          }
        }

        const rsvpsResponse = await fetch(`/api/events/by-slug/${slug}/rsvps`);
        if (!rsvpsResponse.ok) {
          throw new Error("Error al obtener confirmaciones");
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
    XLSX.writeFile(
      workbook,
      `confirmaciones-${event?.slug || "evento"}.xlsx`
    );
  };

  const stats = {
    total: rsvps.length,
    confirmados: rsvps.filter((r) => r.asistencia === "si").length,
    noAsisten: rsvps.filter((r) => r.asistencia === "no").length,
    pendientes: rsvps.filter((r) => r.asistencia === "quizas").length,
    totalPersonas: rsvps.reduce((sum, r) => {
      if (r.asistencia === "si") {
        return sum + 1 + r.menores_cinco + r.entre_cinco_diez + r.mayores_diez;
      }
      return sum;
    }, 0),
  };

  if (loading || !authenticated) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse mb-10">
            <div className="h-7 bg-gray-800 rounded w-56 mb-2" />
            <div className="h-4 bg-gray-800/60 rounded w-40" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 animate-pulse"
              >
                <div className="h-3 bg-gray-800 rounded w-16 mb-3" />
                <div className="h-7 bg-gray-800 rounded w-10" />
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-800/60 rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {event?.name || "Panel del Evento"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona las confirmaciones de asistencia
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/e/${slug}/edit`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-750 hover:text-gray-300 hover:border-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
              Editar
            </Link>
            <Link
              href={`/e/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-750 hover:text-gray-300 hover:border-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              Ver evento
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-750 hover:text-gray-300 hover:border-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
              Salir
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8 text-sm animate-[fadeIn_0.3s_ease-out]">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Respuestas", value: stats.total, accent: "text-blue-400" },
            { label: "Confirmados", value: stats.confirmados, accent: "text-emerald-400" },
            { label: "No asisten", value: stats.noAsisten, accent: "text-red-400" },
            { label: "Pendientes", value: stats.pendientes, accent: "text-amber-400" },
            { label: "Total personas", value: stats.totalPersonas, accent: "text-violet-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {stat.label}
              </span>
              <p className={`text-2xl font-bold mt-1 ${stat.accent}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Export button ── */}
        {rsvps.length > 0 && (
          <div className="mb-6">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Descargar Excel
            </button>
          </div>
        )}

        {/* ── RSVPs Table ── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acompañantes
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restricciones
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {rsvps.map((rsvp) => (
                  <tr
                    key={rsvp.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-white">
                        {rsvp.nombre} {rsvp.apellido}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded ${
                          rsvp.asistencia === "si"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : rsvp.asistencia === "no"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {rsvp.asistencia === "si"
                          ? "Confirma"
                          : rsvp.asistencia === "no"
                          ? "No asiste"
                          : "Quizás"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-400">
                      {rsvp.asistencia === "si" && (
                        <span>
                          {rsvp.menores_cinco +
                            rsvp.entre_cinco_diez +
                            rsvp.mayores_diez >
                          0
                            ? `+${rsvp.menores_cinco + rsvp.entre_cinco_diez + rsvp.mayores_diez}`
                            : "Sin acompañantes"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">
                      {rsvp.restricciones_alimentarias || "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rsvp.created_at).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rsvps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-xl mb-4">
                📋
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Sin confirmaciones aún
              </h3>
              <p className="text-gray-500 text-xs text-center max-w-xs">
                Cuando los invitados confirmen asistencia, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
