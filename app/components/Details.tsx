"use client";

import { motion } from "framer-motion";

interface DetailsProps {
  eventType?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  dressCode?: string | null;
  ceremonyTime?: string | null;
  receptionTime?: string | null;
}

export default function Details({
  eventType,
  venueName,
  venueAddress,
  dressCode,
  ceremonyTime,
  receptionTime
}: DetailsProps) {
  return (
    <motion.section
      id="details"
      className="w-full py-20 px-6 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Detalles del Evento
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {(venueName || venueAddress) && (
            <motion.div
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, white)',
                borderLeft: '4px solid var(--color-primary)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--color-primary)' }}
              >
                📍 Lugar
              </h3>
              {venueName && <p className="text-gray-700 font-medium mb-1">{venueName}</p>}
              {venueAddress && <p className="text-gray-600">{venueAddress}</p>}
            </motion.div>
          )}

          {eventType === "wedding" && (ceremonyTime || receptionTime) && (
            <motion.div
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-secondary) 10%, white)',
                borderLeft: '4px solid var(--color-secondary)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--color-primary)' }}
              >
                🕐 Horarios
              </h3>
              {ceremonyTime && <p className="text-gray-700 mb-2">Ceremonia: {ceremonyTime}</p>}
              {receptionTime && <p className="text-gray-600">Recepción: {receptionTime}</p>}
            </motion.div>
          )}

          {dressCode && (
            <motion.div
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-secondary) 10%, white)',
                borderLeft: '4px solid var(--color-secondary)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--color-primary)' }}
              >
                👔 Código de Vestimenta
              </h3>
              <p className="text-gray-700">{dressCode}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
