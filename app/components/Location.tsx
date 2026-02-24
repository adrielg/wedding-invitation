"use client";

import { motion } from "framer-motion";

interface LocationProps {
  venueName?: string | null;
  venueAddress?: string | null;
  mapUrl?: string | null;
  ceremonyTime?: string | null;
  receptionTime?: string | null;
  parkingInfo?: string | null;
  eventDate?: Date;
}

export default function Location({
  venueName,
  venueAddress,
  mapUrl,
  ceremonyTime,
  receptionTime,
  parkingInfo,
  eventDate
}: LocationProps) {
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2417.384625132936!2d-60.45334602121145!3d-31.78135841730976!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sar!4v1769713471570!5m2!1ses!2sar";
  const displayVenueName = venueName || "Complejo Oscar Chapino";
  const displayVenueAddress = venueAddress || "Av. Jorge Newbery 5000, Paraná, ER";
  const displayMapUrl = mapUrl || defaultMapUrl;
  const displayCeremonyTime = ceremonyTime || "12:30 PM";
  const displayReceptionTime = receptionTime || "13:30 PM";
  const displayParkingInfo = parkingInfo || "Estacionamiento gratuito disponible";
  
  const formattedDate = eventDate ? new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(eventDate) : "Domingo 22 de Noviembre 2026";

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ¿Dónde festejamos?
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {displayVenueName} – {displayVenueAddress}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          {/* Mapa */}
          <motion.div
            className="overflow-hidden rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <iframe
              src={displayMapUrl}
              className="w-full h-[400px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del evento"
            ></iframe>
          </motion.div>

          {/* Información */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                borderLeft: '4px solid var(--color-primary)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                📍 Ubicación
              </h3>
              <p className="text-gray-700">
                {displayVenueName}
              </p>
              <p className="text-gray-600">
                {displayVenueAddress}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(displayVenueName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Ver en Google Maps →
              </a>
            </div>

            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-secondary) 8%, white)',
                borderLeft: '4px solid var(--color-secondary)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                🕐 Día y Hora de la fiesta
              </h3>
              <p className="text-gray-700 mb-2 capitalize">{formattedDate}</p>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-gray-700">Recepción: {displayCeremonyTime}</li>
                <li className="text-gray-600">Finalización: {displayReceptionTime}</li>
              </ul>
            </div>

            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, white)',
                borderLeft: '4px solid var(--color-primary)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                🅿️ Estacionamiento
              </h3>
              <p className="text-gray-700">{displayParkingInfo}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
