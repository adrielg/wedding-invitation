"use client";

import { motion } from "framer-motion";
import { theme, tw } from "@/app/styles/theme";

export default function Location() {
  return (
    <section className={`py-24 px-6 ${theme.gradients.backgroundReverse}`}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl font-serif font-bold text-center mb-4 ${theme.text.heading}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ¿Dónde nos encontramos?
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Complejo Oscar Chapino – Av. Jorge Newbery 5000, 3100 Paraná, Entre Ríos
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
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2417.384625132936!2d-60.45334602121145!3d-31.78135841730976!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sar!4v1769713471570!5m2!1ses!2sar"
              className="w-full h-[400px]"
              loading="lazy"
              
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

          {/* Información */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={`${tw.card} ${theme.borders.primary}`}>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-2`}>📍 Ubicación</h3>
              <p className="text-gray-700">
                Complejo Oscar Chapino
              </p>
              <p className="text-gray-600">
                Av. Jorge Newbery 5000, Paraná, ER
              </p>
              <a
                href="https://maps.google.com/?q=Complejo+Oscar+Chapino"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.text.body} ${theme.text.linkHover} mt-2 inline-block font-semibold`}
              >
                Ver en Google Maps →
              </a>
            </div>

            <div className={`${tw.card} ${theme.borders.secondary}`}>
              <h3 className={`text-xl font-semibold ${theme.text.body.replace('emerald', 'teal')} mb-2`}>🕐 Día y Hora de la fiesta</h3>
              <p className="text-gray-700 mb-2">Domingo 22 de Noviembre 2026</p>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-gray-700">Recepción: 12:30 PM</li>
                <li className="text-gray-600">Finalización: 21:00 PM</li>
              </ul>
            </div>

            <div className={`${tw.card} ${theme.borders.light}`}>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-2`}>🅿️ Estacionamiento</h3>
              <p className="text-gray-700">
                Estacionamiento disponible en el complejo
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
