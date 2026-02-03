"use client";

import { motion } from "framer-motion";
import { theme, tw } from "@/app/styles/theme";

export default function Ceremony() {
  return (
    <section className={`py-24 px-6 ${theme.gradients.background}`}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl font-serif font-bold text-center mb-4 ${theme.text.heading}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          La Ceremonia
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Información */}
          <motion.div
            className="space-y-6 order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={`${tw.card} ${theme.borders.primary}`}>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-2`}>⛪ Lugar</h3>
              <p className="text-gray-700">
                Parroquia San Benito Abad
              </p>
              <p className="text-gray-600">
                Ramirez 534, San Benito, Entre Ríos
              </p>
            </div>

            <div className={`${tw.card} ${theme.borders.secondary}`}>
              <h3 className={`text-xl font-semibold ${theme.text.body.replace('emerald', 'teal')} mb-2`}>🕐 Día y Horario de la ceremonia</h3>
              <p className="text-gray-700 mb-2">Jueves 19 de Noviembre 2026</p>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-gray-700">Inicio: 10:00 PM</li>
                <li className="text-gray-600">Duración aproximada: 2 horas</li>
              </ul>
            </div>

            <div className={`${tw.card} ${theme.borders.light}`}>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-2`}>ℹ️ Información</h3>
              <p className="text-gray-700">
                Te pedimos que llegues 15 minutos antes del horario
              </p>
            </div>
          </motion.div>

          {/* Decoración */}
          <motion.div
            className="order-1 md:order-2 flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-9xl mb-8"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ⛪
            </motion.div>
            <motion.p
              className="text-center text-gray-600 text-lg font-light max-w-xs"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Un momento sagrado para unir nuestras vidas
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
