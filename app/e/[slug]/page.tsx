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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Evento no encontrado</h1>
          <p className="text-gray-600">{error}</p>
        </div>
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
