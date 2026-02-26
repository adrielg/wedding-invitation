"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import RsvpForm from "@/app/components/RsvpForm";
import Hero from "@/app/components/Hero";
import Countdown from "@/app/components/Countdown";
import { EVENT_TYPE_ICONS } from "@/lib/constants/event-types";
import Details from "@/app/components/Details";
import Location from "@/app/components/Location";
import Timeline from "@/app/components/Timeline";
import Gallery from "@/app/components/Gallery";
import Footer from "@/app/components/Footer";
import { useEventTheme } from "@/lib/hooks/useEventTheme";

interface Event {
  id: string;
  slug: string;
  name: string;
  type: string;
  date: string;
  location: string | null;
  description: string | null;
  config: {
    requires_menu: boolean;
    requires_dietary: boolean;
    requires_allergies: boolean;
    theme_primary_color?: string;
    theme_secondary_color?: string;
    theme_background?: string;
    theme_font_family?: string;
    hero_image_url?: string | null;
    venue_name?: string | null;
    venue_address?: string | null;
    venue_map_url?: string | null;
    ceremony_time?: string | null;
    reception_time?: string | null;
    parking_info?: string | null;
    dress_code?: string | null;
  } | null;
}

export default function EventPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicar tema del evento
  useEventTheme(event?.config ? {
    primaryColor: event.config.theme_primary_color || '#f43f5e',
    secondaryColor: event.config.theme_secondary_color || '#fda4af',
    background: event.config.theme_background || 'gradient',
    fontFamily: event.config.theme_font_family || 'Playfair Display',
    heroImage: event.config.hero_image_url
  } : null);

  // Actualizar título e icono según tipo de evento
  useEffect(() => {
    if (!event) return;

    const eventIcon = EVENT_TYPE_ICONS[event.type] || '🎆';
    
    // Título solo con el nombre del evento
    document.title = event.name;

    // Favicon con el emoji del tipo de evento
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${eventIcon}</text></svg>`;
    
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
  }, [event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/by-slug/${slug}`);
        
        if (!response.ok) {
          throw new Error('Evento no encontrado');
        }
        
        const data = await response.json();
        
        // Verificar si el evento está activo
        if (!data.is_active) {
          throw new Error('Este evento no está disponible');
        }

        // Verificar si el evento ya pasó
        if (new Date(data.date) < new Date()) {
          throw new Error('Este evento ya ha finalizado');
        }
        
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando evento...</p>
      </div>
    );
  }

  if (error || !event) {
    const isExpired = error === 'Este evento ya ha finalizado';
    const isInactive = error === 'Este evento no está disponible';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-rose-50/30 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* Ilustración SVG */}
          <div className="mx-auto mb-8 w-48 h-48 relative">
            {isExpired ? (
              // Reloj de arena / calendario finalizado
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="url(#expiredGrad)" opacity="0.1" />
                <circle cx="100" cy="100" r="70" fill="url(#expiredGrad)" opacity="0.08" />
                <rect x="55" y="40" width="90" height="100" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="55" y="40" width="90" height="28" rx="12" fill="url(#expiredGrad)" />
                <rect x="55" y="56" width="90" height="12" fill="url(#expiredGrad)" />
                <circle cx="72" cy="54" r="4" fill="white" />
                <circle cx="128" cy="54" r="4" fill="white" />
                <line x1="55" y1="80" x2="145" y2="80" stroke="#f3f4f6" strokeWidth="1.5" />
                <text x="75" y="100" fontSize="11" fill="#9ca3af" fontFamily="sans-serif">FIN</text>
                <rect x="70" y="106" width="20" height="6" rx="3" fill="#e5e7eb" />
                <rect x="96" y="106" width="20" height="6" rx="3" fill="#e5e7eb" />
                <rect x="70" y="118" width="20" height="6" rx="3" fill="#e5e7eb" />
                <rect x="96" y="118" width="20" height="6" rx="3" fill="#e5e7eb" />
                <circle cx="145" cy="130" r="28" fill="white" stroke="#f97316" strokeWidth="2.5" />
                <path d="M145 112v20" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M145 118l8 8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="145" cy="112" r="2" fill="#f97316" />
                <defs>
                  <linearGradient id="expiredGrad" x1="55" y1="40" x2="145" y2="140">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
              </svg>
            ) : isInactive ? (
              // Evento pausado
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="url(#inactiveGrad)" opacity="0.08" />
                <circle cx="100" cy="100" r="70" fill="url(#inactiveGrad)" opacity="0.06" />
                <rect x="50" y="55" width="100" height="90" rx="16" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="65" y="72" width="70" height="8" rx="4" fill="#e5e7eb" />
                <rect x="65" y="88" width="50" height="8" rx="4" fill="#f3f4f6" />
                <rect x="65" y="104" width="60" height="8" rx="4" fill="#f3f4f6" />
                <rect x="65" y="120" width="40" height="8" rx="4" fill="#f3f4f6" />
                <circle cx="148" cy="55" r="28" fill="white" stroke="#8b5cf6" strokeWidth="2.5" />
                <rect x="139" y="43" width="5" height="24" rx="2.5" fill="#8b5cf6" />
                <rect x="149" y="43" width="5" height="24" rx="2.5" fill="#8b5cf6" />
                <circle cx="56" cy="55" r="14" fill="url(#inactiveGrad)" opacity="0.15" />
                <path d="M52 55h8M56 51v8" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="inactiveGrad" x1="50" y1="50" x2="150" y2="150">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              // No encontrado
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="url(#notfoundGrad)" opacity="0.08" />
                <circle cx="100" cy="100" r="70" fill="url(#notfoundGrad)" opacity="0.06" />
                <circle cx="90" cy="88" r="36" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="90" cy="88" r="26" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 4" />
                <line x1="112" y1="110" x2="142" y2="140" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
                <path d="M82 84h16M82 92h16" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" />
                <circle cx="60" cy="135" r="10" fill="#fef2f2" stroke="#fecaca" strokeWidth="1.5" />
                <text x="56.5" y="139" fontSize="11" fill="#f43f5e">?</text>
                <circle cx="150" cy="65" r="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="1.5" />
                <text x="147" y="69" fontSize="9" fill="#f43f5e">?</text>
                <defs>
                  <linearGradient id="notfoundGrad" x1="50" y1="50" x2="150" y2="150">
                    <stop stopColor="#f43f5e" />
                    <stop offset="1" stopColor="#fb7185" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {isExpired ? 'Evento finalizado' : isInactive ? 'Evento no disponible' : 'Evento no encontrado'}
          </h1>
          <p className="text-gray-500 leading-relaxed text-lg mb-8">
            {isExpired
              ? 'Este evento ya ha pasado. ¡Gracias por tu interés!'
              : isInactive
              ? 'Este evento no se encuentra disponible en este momento.'
              : 'No pudimos encontrar el evento que buscás. Verificá el enlace e intentá de nuevo.'}
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Volver al inicio
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <main>
      <Hero 
        eventName={event.name} 
        eventDate={new Date(event.date)}
        heroImageUrl={event.config?.hero_image_url}
      />
      <Countdown targetDate={new Date(event.date)} />
      
      <section id="detalles" className="py-20 px-4">
        <Details 
          eventType={event.type}
          venueName={event.config?.venue_name}
          venueAddress={event.config?.venue_address}
          dressCode={event.config?.dress_code}
          ceremonyTime={event.config?.ceremony_time}
          receptionTime={event.config?.reception_time}
        />
      </section>

      <section id="ubicacion" className="py-20 px-4 bg-white">
        <Location 
          venueName={event.config?.venue_name}
          venueAddress={event.config?.venue_address}
          mapUrl={event.config?.venue_map_url}
          ceremonyTime={event.config?.ceremony_time}
          receptionTime={event.config?.reception_time}
          parkingInfo={event.config?.parking_info}
          eventDate={new Date(event.date)}
        />
      </section>

      <section id="cronograma" className="py-20 px-4">
        <Timeline />
      </section>

      <section id="galeria" className="py-20 px-4 bg-white">
        <Gallery />
      </section>

      <section id="confirmar" className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Confirmar Asistencia
          </motion.h2>
          <RsvpForm 
            eventId={event.id}
            eventType={event.type}
            eventConfig={event.config}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
