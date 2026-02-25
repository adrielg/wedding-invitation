"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  // Actualizar título y favicon
  useEffect(() => {
    document.title = "Eventos Especiales";
    
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎊</text></svg>`;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Icono principal */}
          <motion.div
            className="text-8xl mb-8"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎊
          </motion.div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            Eventos Especiales
          </h1>

          {/* Descripción */}
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-2xl mx-auto">
            Plataforma para gestionar y confirmar asistencia a tus eventos más importantes
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
            Casamientos • 15 Años • Cumpleaños • Baby Showers • Eventos Corporativos
          </p>

          {/* Características */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2">Personalizable</h3>
              <p className="text-gray-600 text-sm">Diseña tu evento con colores y estilos únicos</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">Fácil de Usar</h3>
              <p className="text-gray-600 text-sm">Confirmaciones de asistencia simples y rápidas</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Control Total</h3>
              <p className="text-gray-600 text-sm">Panel de administración completo</p>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/e/demo"
              className="inline-block bg-gradient-to-r from-rose-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Ver Demo ✨
            </Link>
            <a
              href="https://wa.me/5493434386611?text=Hola!%20Me%20interesa%20crear%20una%20invitación%20digital%20para%20mi%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-rose-600 text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-50 hover:shadow-xl transition-all transform hover:scale-105"
            >
              Contactanos 💬
            </a>
          </motion.div>

          {/* Nota inferior */}
          <p className="text-gray-500 text-sm mt-8">
            ¿Recibiste una invitación? Accede usando el link personalizado que te enviaron.
          </p>

          {/* Link discreto para admin */}
          <p className="text-gray-400 text-xs mt-4">
            <Link href="/admin-login" className="hover:text-gray-600 transition-colors">
              Administrador
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
