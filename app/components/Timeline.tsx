"use client";

import { motion } from "framer-motion";

export default function Timeline() {
  const events = [
    { time: "12:30", title: "Ceremonia", icon: "💒" },
    { time: "13:30", title: "Fotos Familiares", icon: "📸" },
    { time: "14:00", title: "Cóctel", icon: "🍾" },
    { time: "15:30", title: "Comida", icon: "🍽️" },
    { time: "17:00", title: "Fiesta y Baile", icon: "🎉" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl font-serif font-bold text-center mb-16 text-rose-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Cronograma del Día
        </motion.h2>

        <div className="relative">
          {events.map((event, i) => (
            <motion.div
              key={i}
              className="flex gap-8 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">{event.icon}</div>
                <div className="w-1 h-16 bg-gradient-to-b from-rose-300 to-pink-300" />
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold text-rose-600">{event.time}</p>
                <p className="text-lg font-medium text-gray-800">{event.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
