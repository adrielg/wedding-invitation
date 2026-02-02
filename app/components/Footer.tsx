"use client";

import { motion } from "framer-motion";
import { theme } from "@/app/styles/theme";

export default function Footer() {
  return (
    <motion.footer
      className={`${theme.gradients.footer} text-white py-12 px-6`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-serif mb-4">Adriel & Ana</h3>
        <p className={`${theme.text.light} mb-6`}>
          Gracias por acompañarnos en este día tan especial
        </p>
        <p className={`text-sm ${theme.text.light.replace('100', '200')}`}>© 2026. Todos los derechos reservados.</p>
      </div>
    </motion.footer>
  );
}
