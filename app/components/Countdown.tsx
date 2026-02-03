"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { theme } from "@/app/styles/theme";

const EVENT_DATE = new Date("2026-11-22T12:30:00");

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      const diff = EVENT_DATE.getTime() - new Date().getTime();

      if (diff <= 0) {
        setTimeLeft("¡Hoy es el gran día! 🎉");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(
        `${days} días · ${hours} hs · ${minutes} min`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
      <motion.div 
        className={`flex justify-center items-center py-24 px-6${theme.gradients.backgroundReverse}`} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div 
            className="mb-6 text-5xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.div>
          <motion.p 
            className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${theme.gradients.countdown}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {timeLeft || "Cargando..."}
          </motion.p>
          <motion.div className="mt-6 flex justify-center gap-2 text-4xl">
            {["💒", "💍", "🎉"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
  );
}
