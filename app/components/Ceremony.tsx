"use client";

import { motion } from "framer-motion";

export default function Ceremony() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-serif font-bold text-center mb-4 text-rose-600"
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
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-rose-500">
              <h3 className="text-xl font-semibold text-rose-600 mb-2">⛪ Lugar</h3>
              <p className="text-gray-700">
                Parroquia San Benito Abad
              </p>
              <p className="text-gray-600">
                Ramirez 534, San Benito, Entre Ríos
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-pink-500">
              <h3 className="text-xl font-semibold text-pink-600 mb-2">🕐 Horario Ceremonia</h3>
              <p className="text-gray-700">Inicio: 10:00 PM</p>
              <p className="text-gray-600">Duración aproximada: 2 horas</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-rose-400">
              <h3 className="text-xl font-semibold text-rose-600 mb-2">ℹ️ Información</h3>
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
