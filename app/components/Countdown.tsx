"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-11-22T12:30:00");

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
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

  return (
    <div className="text-3xl font-semibold text-center mt-6">
      {timeLeft}
    </div>
  );
}
