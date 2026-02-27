"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EVENT_TYPE_LABELS, EVENT_TYPE_ICONS, getEventTypeColors } from "@/lib/constants/event-types";
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

interface PremiumPayment {
  id: string;
  email: string;
  phone: string | null;
  amount: number;
  created_at: string;
}

/* ── Skeleton loader ── */
function SkeletonCard() {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-800/60 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-800/60 rounded w-full" />
        <div className="h-3 bg-gray-800/60 rounded w-2/3" />
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
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all animate-[slideUp_0.3s_ease-out] ${
      type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4 animate-[scaleIn_0.2s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-sm text-red-400">⚠</div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:text-gray-300 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
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
  const [premiumPayments, setPremiumPayments] = useState<PremiumPayment[]>([]);
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
        
        const [eventsRes, paymentsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/payments/premium-pending"),
        ]);
        
        if (!eventsRes.ok) throw new Error("Error al obtener eventos");
        if (!paymentsRes.ok) throw new Error("Error al obtener pagos premium");
        
        setEvents(await eventsRes.json());
        setPremiumPayments(await paymentsRes.json());
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
      <main className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse mb-10">
            <div className="h-7 bg-gray-800 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-800/60 rounded w-36" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 animate-pulse">
                <div className="h-3 bg-gray-800 rounded w-16 mb-3" />
                <div className="h-7 bg-gray-800 rounded w-10" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Panel de Eventos
            </h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona todos tus eventos desde aquí</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events/create"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Nuevo evento
            </Link>
            <SignOutButton />
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
            { label: "Total", value: stats.total, accent: "text-blue-400" },
            { label: "Activos", value: stats.active, accent: "text-emerald-400" },
            { label: "Inactivos", value: stats.inactive, accent: "text-gray-500" },
            { label: "Próximos", value: stats.upcoming, accent: "text-violet-400" },
            { label: "Premium Pendientes", value: premiumPayments.length, accent: "text-rose-400" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1.5">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Premium Payments Section ── */}
        {premiumPayments.length > 0 && (
          <div className="bg-gradient-to-br from-rose-900/20 to-violet-900/20 border border-rose-500/30 rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Pagos Premium Pendientes</h3>
                <p className="text-sm text-gray-400">Clientes esperando eventos personalizados</p>
              </div>
            </div>

            <div className="space-y-3">
              {premiumPayments.map((payment) => (
                <div key={payment.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{payment.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>💰 ${payment.amount.toLocaleString("es-AR")}</span>
                      {payment.phone && <span>📞 {payment.phone}</span>}
                      <span>🕐 {new Date(payment.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${payment.phone?.replace(/\D/g, "")}?text=Hola!%20Vi%20tu%20pago%20Premium.%20Ya%20estamos%20trabajando%20en%20tu%20evento%20personalizado.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Filters bar ── */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input
                type="text"
                placeholder="Buscar por nombre o slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-gray-600 transition-all placeholder:text-gray-600"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-gray-600 transition-all"
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
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-gray-600 transition-all"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          {/* Active filters summary */}
          {(search || filterType !== "all" || filterStatus !== "all") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
              <span className="text-xs text-gray-500">Mostrando {filteredEvents.length} de {events.length}</span>
              <button
                onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); }}
                className="text-xs text-gray-400 hover:text-white font-medium ml-auto"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* ── Event cards grid ── */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => {
              const isPast = new Date(event.date) < new Date();
              const colors = getEventTypeColors(event.type);
              return (
                <div
                  key={event.id}
                  className={`group relative bg-gray-900 rounded-xl border overflow-hidden transition-all hover:-translate-y-0.5 ${
                    !event.is_active
                      ? "border-gray-800 opacity-50"
                      : isPast
                      ? "border-gray-800 opacity-70"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {/* Color accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${colors.gradient} ${
                    !event.is_active ? "opacity-20" : isPast ? "opacity-40" : "opacity-80"
                  }`} />

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg shrink-0">
                          {getEventTypeIcon(event.type)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white truncate leading-tight text-sm">{event.name}</h3>
                          <span className="text-xs text-gray-500">{getEventTypeLabel(event.type)}</span>
                        </div>
                      </div>
                      {/* Status */}
                      <div className="flex items-center gap-2 shrink-0">
                        {(!event.is_active || isPast) && (
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            !event.is_active
                              ? "bg-gray-800 text-gray-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {!event.is_active ? "Off" : "Fin"}
                          </span>
                        )}
                        <button
                          onClick={() => handleToggleActive(event.id, event.is_active)}
                          disabled={togglingId === event.id}
                          className={`relative shrink-0 w-9 h-5 rounded-full transition-colors focus:outline-none ${
                            event.is_active ? "bg-emerald-500" : "bg-gray-700"
                          } ${togglingId === event.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                          title={event.is_active ? "Desactivar" : "Activar"}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            event.is_active ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                        <span>{formatDate(event.date)}</span>
                        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isPast
                            ? "bg-gray-800 text-gray-500"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {daysUntil(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.036a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" /></svg>
                        <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded font-mono text-gray-400 truncate">/e/{event.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="border-t border-gray-800 px-4 py-2.5 flex items-center gap-1">
                    <Link
                      href={`/e/${event.slug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white px-2 py-1 rounded-md hover:bg-gray-800 transition-colors"
                      title="Ver evento"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      Ver
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white px-2 py-1 rounded-md hover:bg-gray-800 transition-colors"
                      title="Editar evento"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                      Editar
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/rsvps`}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white px-2 py-1 rounded-md hover:bg-gray-800 transition-colors"
                      title="Ver RSVPs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                      RSVPs
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ id: event.id, name: event.name })}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-400 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors ml-auto"
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
            <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl mb-5">
              {events.length === 0 ? "🎉" : "🔍"}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {events.length === 0 ? "Crea tu primer evento" : "Sin resultados"}
            </h3>
            <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
              {events.length === 0
                ? "Comienza creando un evento para que tus invitados puedan confirmar asistencia."
                : "No se encontraron eventos con esos filtros."}
            </p>
            {events.length === 0 ? (
              <Link
                href="/admin/events/create"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Crear evento
              </Link>
            ) : (
              <button
                onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); }}
                className="text-gray-400 hover:text-white text-sm font-medium"
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
