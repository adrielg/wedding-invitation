"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const scrollToSection = () => {
    const element = document.getElementById("details");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-white to-pink-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{ rotate: 360, y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-6xl"
        animate={{ rotate: -360, y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        🌹
      </motion.div>

      <div className="text-center z-10 px-6">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4"
          variants={itemVariants}
        >
          Adriel & Ana
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-gray-600 mb-6 font-light"
          variants={itemVariants}
        >
          Nos alegra invitarte a celebrar nuestro matrimonio
        </motion.p>

        <motion.p
          className="text-lg sm:text-xl text-gray-500 mb-8"
          variants={itemVariants}
        >
          22 de Noviembre de 2026
        </motion.p>

        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToSection}
        >
          Ver Detalles
        </motion.button>
      </div>
    </motion.section>
  );
}
