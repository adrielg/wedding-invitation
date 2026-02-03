"use client";

import Hero from "./components/Hero";
import Details from "./components/Details";
import Countdown from "./components/Countdown";
import Ceremony from "./components/Ceremony";
import Gallery from "./components/Gallery";
import Location from "./components/Location";
import RsvpForm from "./components/RsvpForm";
import Footer from "./components/Footer";
import { section } from "framer-motion/m";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-800">
      <section>
        <Hero />
      </section>
      
      <section id="details">
        <Countdown />
      </section>

      <section>
        <Ceremony />
      </section>

      <section>
        <Gallery /> 
      </section>
      
      <section>
        <Location />
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 px-6 bg-white fade-up">
        <h2 className="text-2xl font-serif mb-4 text-center">
          ¿Nos acompañás en este día tan especial?
        </h2>
        <RsvpForm />
      </section>

      <Footer />
    </main>
  );
}
