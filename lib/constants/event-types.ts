/**
 * Definición centralizada de tipos de evento.
 * Cualquier cambio en tipos de evento se hace SOLO aquí.
 * 
 * IMPORTANTE: Los values deben coincidir con el enum EventType de Prisma (schema.prisma).
 * Si se agrega un nuevo tipo, también hay que crear una migración de Prisma.
 */

export const EVENT_TYPES = [
  { value: "wedding", label: "Casamiento", icon: "💍" },
  { value: "fifteen", label: "15 Años", icon: "🎉" },
  { value: "adult_birthday", label: "Cumpleaños Adulto", icon: "🎂" },
  { value: "childrens_event", label: "Evento Infantil", icon: "🎈" },
  { value: "babyshower", label: "Baby Shower", icon: "👶" },
  { value: "corporate", label: "Evento Corporativo", icon: "💼" },
  { value: "family_celebration", label: "Celebración Familiar", icon: "🎊" },
  { value: "other", label: "Otro", icon: "🎆" },
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

/** Tipos que NO permiten niños en RSVP */
export const TYPES_WITHOUT_CHILDREN: EventTypeValue[] = ["babyshower", "corporate"];

/** Tipos que muestran ceremonia/recepción */
export const TYPES_WITH_CEREMONY: EventTypeValue[] = ["wedding"];

/** Tipos que requieren menú formal */
export const TYPES_WITH_FORMAL_MENU: EventTypeValue[] = ["wedding", "fifteen", "corporate"];

/** Tipos que muestran dress code */
export const TYPES_WITH_DRESS_CODE: EventTypeValue[] = ["wedding", "fifteen", "corporate"];
