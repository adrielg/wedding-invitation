"use client";

import Hero from "./Hero";
import Countdown from "./Countdown";
import Details from "./Details";
import Location from "./Location";
import { EventTypeValue } from "@/lib/constants/event-types";

interface EventPreviewProps {
  name: string;
  type: EventTypeValue;
  date: string;
  location: string;
  description: string;
  // Campos adicionales del admin form
  venueAddress?: string;
  venueName?: string;
  venueMapUrl?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  parkingInfo?: string;
  dressCode?: string;
  heroImageUrl?: string;
}

export default function EventPreview({
  name,
  type,
  date,
  location,
  description,
  venueAddress,
  venueName,
  venueMapUrl,
  ceremonyTime,
  receptionTime,
  parkingInfo,
  dressCode,
  heroImageUrl,
}: EventPreviewProps) {
  // Convertir string de fecha a Date object
  const eventDate = date ? new Date(date + 'T00:00:00') : new Date();

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50">
      {/* Preview Label - Ajustado a la izquierda para no superponerse */}
      <div className="sticky top-4 z-40 flex justify-start px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 text-xs text-gray-400 font-medium shadow-lg">
          👁️ Vista Previa
        </div>
      </div>

      <main className="mt-[-48px]">
        {/* Hero Section */}
        <Hero 
          eventName={name || "Nombre del Evento"} 
          eventDate={eventDate}
          heroImageUrl={heroImageUrl}
        />

        {/* Countdown */}
        {date && <Countdown targetDate={eventDate} />}
        
        {/* Details */}
        {(venueName || venueAddress || dressCode || ceremonyTime) && (
          <section className="py-20 px-4">
            <Details 
              eventType={type}
              venueName={venueName}
              venueAddress={venueAddress || location}
              dressCode={dressCode}
              ceremonyTime={ceremonyTime}
              receptionTime={receptionTime}
            />
          </section>
        )}

        {/* Location */}
        {(venueName || venueAddress) && (
          <section className="py-20 px-4 bg-white">
            <Location 
              venueName={venueName}
              venueAddress={venueAddress || location}
              mapUrl={venueMapUrl}
              ceremonyTime={ceremonyTime}
              receptionTime={receptionTime}
              parkingInfo={parkingInfo}
              eventDate={eventDate}
            />
          </section>
        )}

        {/* Empty State */}
        {!name && !date && !location && (
          <section className="py-20 px-4 bg-white">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-4 opacity-20">👈</div>
              <p className="text-gray-500 text-lg">
                Completá el formulario para ver el preview de tu evento
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
