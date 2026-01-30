"use client";

import { motion } from "framer-motion";

export default function Location() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-serif font-bold text-center mb-4 text-rose-600"
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
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-rose-500">
              <h3 className="text-xl font-semibold text-rose-600 mb-2">📍 Ubicación</h3>
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
                className="text-rose-500 hover:text-rose-600 mt-2 inline-block font-semibold"
              >
                Ver en Google Maps →
              </a>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-pink-500">
              <h3 className="text-xl font-semibold text-pink-600 mb-2">🕐 Horario Fiesta</h3>
              <p className="text-gray-700">Recepción: 12:30 PM</p>
              <p className="text-gray-600">Finalización: 21:00 PM</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-rose-400">
              <h3 className="text-xl font-semibold text-rose-600 mb-2">🅿️ Estacionamiento</h3>
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
