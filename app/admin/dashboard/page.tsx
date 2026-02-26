"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EVENT_TYPE_LABELS, EVENT_TYPE_ICONS } from "@/lib/constants/event-types";
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

/* ── Skeleton loader ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

/* ── Toast notification ── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all animate-[slideUp_0.3s_ease-out] ${
      type === "success" ? "bg-emerald-600" : "bg-red-600"
    }`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">✕</button>
    </div>
  );
}

/* ── Confirm modal ── */
function ConfirmModal({ title, message, onConfirm, onCancel }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-[scaleIn_0.2s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">⚠️</div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Actualizar título y favicon del dashboard
  useEffect(() => {
    document.title = "Panel de Eventos";
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement("link");
    faviconLink.type = "image/svg+xml";
    faviconLink.rel = "icon";
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>`;
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
  }, []);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authResponse = await fetch("/api/check-auth");
        if (!authResponse.ok) { router.push("/admin-login"); return; }
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error("Error al obtener eventos");
        setEvents(await response.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetchData();
  }, [router]);

  /* ── Filtered events ── */
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        ev.name.toLowerCase().includes(search.toLowerCase()) ||
        ev.slug.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || ev.type === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && ev.is_active) ||
        (filterStatus === "inactive" && !ev.is_active);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, search, filterType, filterStatus]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const active = events.filter((e) => e.is_active).length;
    const upcoming = events.filter((e) => new Date(e.date) > new Date()).length;
    return { total: events.length, active, inactive: events.length - active, upcoming };
  }, [events]);

  /* ── Unique event types present ── */
  const eventTypesPresent = useMemo(() => {
    return [...new Set(events.map((e) => e.type))];
  }, [events]);

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar evento");
      setEvents(events.filter((e) => e.id !== eventId));
      setToast({ message: "Evento eliminado exitosamente", type: "success" });
    } catch {
      setToast({ message: "Error al eliminar el evento", type: "error" });
    } finally {
      setDeleteModal(null);
    }
  };

  const handleToggleActive = async (eventId: string, currentStatus: boolean) => {
    setTogglingId(eventId);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (!response.ok) throw new Error("Error al actualizar estado");
      setEvents(events.map((e) => (e.id === eventId ? { ...e, is_active: !currentStatus } : e)));
      setToast({ message: `Evento ${!currentStatus ? "activado" : "desactivado"}`, type: "success" });
    } catch {
      setToast({ message: "Error al cambiar el estado del evento", type: "error" });
    } finally {
      setTogglingId(null);
    }
  };

  const getEventTypeLabel = (type: string) => EVENT_TYPE_LABELS[type] || type;
  const getEventTypeIcon = (type: string) => EVENT_TYPE_ICONS[type] || "🎉";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  };

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Pasado";
    if (diff === 0) return "¡Hoy!";
    if (diff === 1) return "Mañana";
    return `En ${diff} días`;
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse mb-10">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-12" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete modal */}
      {deleteModal && (
        <ConfirmModal
          title="Eliminar evento"
          message={`¿Estás seguro de eliminar "${deleteModal.name}"? Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(deleteModal.id)}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Panel de Eventos
            </h1>
            <p className="text-gray-500 mt-1">Gestiona todos tus eventos desde aquí</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events/create"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-rose-200 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200 active:scale-[0.98] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Nuevo evento
            </Link>
            <SignOutButton />
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-2xl mb-8 animate-[fadeIn_0.3s_ease-out]">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold text-sm">Ocurrió un error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, icon: "📋", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
            { label: "Activos", value: stats.active, icon: "✅", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
            { label: "Inactivos", value: stats.inactive, icon: "⏸️", color: "from-gray-400 to-gray-500", bg: "bg-gray-50" },
            { label: "Próximos", value: stats.upcoming, icon: "📅", color: "from-violet-500 to-violet-600", bg: "bg-violet-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.label}</span>
                <span className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center text-base group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input
                type="text"
                placeholder="Buscar por nombre o slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-gray-700"
            >
              <option value="all">Todos los tipos</option>
              {eventTypesPresent.map((t) => (
                <option key={t} value={t}>{getEventTypeIcon(t)} {getEventTypeLabel(t)}</option>
              ))}
            </select>
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-gray-700"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          {/* Active filters summary */}
          {(search || filterType !== "all" || filterStatus !== "all") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Mostrando {filteredEvents.length} de {events.length}</span>
              <button
                onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); }}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-auto"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* ── Event cards grid ── */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => {
              const isPast = new Date(event.date) < new Date();
              return (
                <div
                  key={event.id}
                  className={`group bg-white rounded-2xl shadow-sm border transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    event.is_active ? "border-gray-100" : "border-gray-200 opacity-75"
                  }`}
                >
                  {/* Card header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {getEventTypeIcon(event.type)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate leading-tight">{event.name}</h3>
                          <span className="text-xs text-gray-400 font-medium">{getEventTypeLabel(event.type)}</span>
                        </div>
                      </div>
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggleActive(event.id, event.is_active)}
                        disabled={togglingId === event.id}
                        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                          event.is_active ? "bg-emerald-500" : "bg-gray-300"
                        } ${togglingId === event.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                        title={event.is_active ? "Desactivar" : "Activar"}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          event.is_active ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                        <span>{formatDate(event.date)}</span>
                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPast
                            ? "bg-gray-100 text-gray-500"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {daysUntil(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.036a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" /></svg>
                        <code className="text-xs bg-gray-50 px-2 py-0.5 rounded-md font-mono text-gray-600 truncate">/e/{event.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-1">
                    <Link
                      href={`/e/${event.slug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver evento"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      Ver
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Editar evento"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                      Editar
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/rsvps`}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                      title="Ver RSVPs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                      RSVPs
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ id: event.id, name: event.name })}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors ml-auto"
                      title="Eliminar evento"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-4xl mb-6 animate-bounce">
              {events.length === 0 ? "🎉" : "🔍"}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {events.length === 0 ? "¡Crea tu primer evento!" : "Sin resultados"}
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              {events.length === 0
                ? "Comienza creando un evento para que tus invitados puedan confirmar asistencia."
                : "No se encontraron eventos que coincidan con tu búsqueda. Prueba con otros filtros."}
            </p>
            {events.length === 0 ? (
              <Link
                href="/admin/events/create"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-rose-200 hover:bg-rose-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Crear evento
              </Link>
            ) : (
              <button
                onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); }}
                className="text-rose-600 hover:text-rose-700 font-medium text-sm"
              >
                Limpiar filtros →
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
