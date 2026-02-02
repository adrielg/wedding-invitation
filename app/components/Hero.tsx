"use client";

import { motion } from "framer-motion";
import { theme, tw } from "@/app/styles/theme";

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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/photos/wedding-frame-mobile.png" />
          <source media="(min-width: 769px)" srcSet="/photos/wedding-frame-desktop.png" />
          <img
            src="/photos/wedding-frame-desktop.png"
            alt="Wedding frame"
            className="w-full h-full object-fill"
          />
        </picture>
        {/* Semi-transparent overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* Decorative elements */}
      
      <div className="text-center z-10 px-6">
        <motion.h1
          className={`text-5xl sm:text-6xl md:text-7xl font-serif font-bold ${theme.gradients.text} mb-4 drop-shadow-sm`}
          variants={itemVariants}
        >
          Adriel & Ana
        </motion.h1>

        <motion.p
          className={`text-xl sm:text-2xl ${theme.text.subheading} mb-6 font-light drop-shadow-sm`}
          variants={itemVariants}
        >
          Nos alegra invitarte a celebrar nuestro matrimonio
        </motion.p>

        <motion.p
          className={`text-lg sm:text-xl ${theme.text.body} mb-8 drop-shadow-sm`}
          variants={itemVariants}
        >
          22 de Noviembre de 2026
        </motion.p>

        <motion.button
          className={tw.button}
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
