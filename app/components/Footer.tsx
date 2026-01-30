"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-r from-rose-900 to-pink-900 text-white py-12 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-serif mb-4">Adriel & Ana</h3>
        <p className="text-rose-100 mb-6">
          Gracias por acompañarnos en este día tan especial
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="hover:text-rose-300 transition">📱</a>
          <a href="#" className="hover:text-rose-300 transition">💌</a>
          <a href="#" className="hover:text-rose-300 transition">📍</a>
        </div>
        <p className="text-sm text-rose-200">© 2026 Adriel & Ana. Todos los derechos reservados.</p>
      </div>
    </motion.footer>
  );
}
