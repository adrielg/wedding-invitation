/**
 * Definición centralizada de tipos de evento.
 * Cualquier cambio en tipos de evento se hace SOLO aquí.
 * 
 * IMPORTANTE: Los values deben coincidir con el enum EventType de Prisma (schema.prisma).
 * Si se agrega un nuevo tipo, también hay que crear una migración de Prisma.
 */

export const EVENT_TYPES = [
  { value: "wedding",            label: "Casamiento",           icon: "💍", colors: { gradient: "from-rose-500 to-pink-500",      bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700" } },
  { value: "fifteen",            label: "15 Años",              icon: "🎉", colors: { gradient: "from-fuchsia-500 to-purple-500", bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700" } },
  { value: "adult_birthday",     label: "Cumpleaños Adulto",    icon: "🎂", colors: { gradient: "from-amber-500 to-orange-500",   bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" } },
  { value: "childrens_event",    label: "Evento Infantil",      icon: "🎈", colors: { gradient: "from-sky-500 to-cyan-500",       bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700" } },
  { value: "babyshower",         label: "Baby Shower",          icon: "👶", colors: { gradient: "from-teal-500 to-emerald-500",   bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700" } },
  { value: "corporate",          label: "Evento Corporativo",   icon: "💼", colors: { gradient: "from-slate-500 to-gray-600",     bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700" } },
  { value: "family_celebration", label: "Celebración Familiar", icon: "🎊", colors: { gradient: "from-violet-500 to-indigo-500",  bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700" } },
  { value: "other",              label: "Otro",                 icon: "🎆", colors: { gradient: "from-gray-500 to-zinc-500",      bg: "bg-gray-50",    border: "border-gray-200",    text: "text-gray-700" } },
] as const;

/** Los values válidos de tipo de evento */
export type EventTypeValue = (typeof EVENT_TYPES)[number]["value"];

/** Mapa de value → label para mostrar en UI */
export const EVENT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.label])
);

/** Mapa de value → emoji icon */
export const EVENT_TYPE_ICONS: Record<string, string> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.icon])
);

/** Tipo para los colores de cada tipo de evento */
export type EventTypeColors = {
  gradient: string;
  bg: string;
  border: string;
  text: string;
};

/** Colores por defecto para tipos desconocidos */
const DEFAULT_COLORS: EventTypeColors = { gradient: "from-gray-500 to-zinc-500", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };

/** Mapa de value → colores para UI */
export const EVENT_TYPE_COLORS: Record<string, EventTypeColors> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.colors])
);

/** Helper: obtener colores por tipo (con fallback) */
export const getEventTypeColors = (type: string): EventTypeColors =>
  EVENT_TYPE_COLORS[type] || DEFAULT_COLORS;

/** Tipos que NO permiten niños en RSVP */
export const TYPES_WITHOUT_CHILDREN: EventTypeValue[] = ["babyshower", "corporate"];

/** Tipos que muestran ceremonia/recepción */
export const TYPES_WITH_CEREMONY: EventTypeValue[] = ["wedding"];

/** Tipos que requieren menú formal */
export const TYPES_WITH_FORMAL_MENU: EventTypeValue[] = ["wedding", "fifteen", "corporate"];

/** Tipos que muestran dress code */
export const TYPES_WITH_DRESS_CODE: EventTypeValue[] = ["wedding", "fifteen", "corporate"];
