"use client";

import { motion } from "framer-motion";
import { theme, tw } from "@/app/styles/theme";

interface HeroProps {
  eventName: string;
  eventDate: Date;
  heroImageUrl?: string | null;
}

export default function Hero({ eventName, eventDate, heroImageUrl }: HeroProps) {
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(eventDate);
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
        {heroImageUrl ? (
          <>
            <img
              src={heroImageUrl}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <>
            <picture>
              <source media="(max-width: 768px)" srcSet="/photos/wedding-frame-mobile.png" />
              <source media="(min-width: 769px)" srcSet="/photos/wedding-frame-desktop.png" />
              <img
                src="/photos/wedding-frame-desktop.png"
                alt="Wedding frame"
                className="w-full h-full object-fill"
              />
            </picture>
            <div className="absolute inset-0 bg-white/30" />
          </>
        )}
      </div>

      {/* Decorative elements */}
      
      <div className="text-center z-10 px-6">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 drop-shadow-sm"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          variants={itemVariants}
        >
          {eventName}
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl mb-6 font-light drop-shadow-sm"
          style={{ color: 'var(--color-primary)' }}
          variants={itemVariants}
        >
          Nos alegra invitarte a celebrar este momento especial
        </motion.p>

        <motion.p
          className="text-lg sm:text-xl mb-8 drop-shadow-sm"
          style={{ color: 'var(--color-primary)' }}
          variants={itemVariants}
        >
          {formattedDate}
        </motion.p>

        <motion.button
          className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: 'var(--color-primary)' }}
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
