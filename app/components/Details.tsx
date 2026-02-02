"use client";

import { motion } from "framer-motion";
import { theme } from "@/app/styles/theme";

export default function Details() {
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
          className={`text-4xl md:text-5xl font-serif font-bold text-center mb-16 ${theme.text.heading}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Detalles de la Ceremonia
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className={`p-6 bg-gradient-to-br ${theme.backgrounds.card} rounded-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-2xl font-semibold ${theme.text.heading} mb-4`}>📍 Ubicación</h3>
            <p className="text-gray-700 mb-2">Iglesia Santiago Apóstol</p>
            <p className="text-gray-600">Calle Principal 123, Ciudad</p>
          </motion.div>

          <motion.div
            className={`p-6 bg-gradient-to-br ${theme.backgrounds.cardReverse} rounded-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-2xl font-semibold ${theme.text.body.replace('emerald', 'teal')} mb-4`}>🕐 Horario</h3>
            <p className="text-gray-700 mb-2">Ceremonia: 12:30 PM</p>
            <p className="text-gray-600">Recepción: 13:30 PM</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
