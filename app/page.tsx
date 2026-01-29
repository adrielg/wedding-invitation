"use client";

import Countdown from "./components/Countdown";
import RsvpForm from "./components/RsvpForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-800">

      {/* HERO */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 fade-up">
        <h1 className="text-5xl md:text-6xl font-serif mb-6">
  ¡Nos casamos! 💍
</h1>

<p className="text-xl md:text-2xl max-w-2xl mx-auto text-neutral-600">
  Después de tantas historias compartidas, risas, desafíos y sueños,
  llegó el momento de decir <span className="font-semibold">“sí, para siempre”</span>.
  <br />
  Nos encantaría que seas parte de este día inolvidable.
  <br /><br />
</p>
        <button
          onClick={() =>
            document
              .getElementById("rsvp")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full
hover:bg-[var(--color-secondary)] transition"
>
          Quiero acompañarlos 💖
        </button>
      </section>

      {/* FECHA */}
      <section className="py-24 bg-white text-center fade-up">
        <p className="uppercase tracking-widest text-sm mb-2">
          Guardá este día en tu corazón
        </p>

        <h2 className="text-4xl font-serif">
          Sábado 12 de Octubre de 2026
        </h2>

        <p className="text-lg text-gray-600 mt-2">
          18:30 hs
        </p>
      </section>

      <Countdown />

      {/* MAPA */}
      <section className="py-24 bg-neutral-100 fade-up">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">¿Dónde?</h2>
          <p className="mb-6 text-lg">
            Complejo Oscar Chapino – Av. Jorge Newbery 5000, 3100 Paraná, Entre Ríos
          </p>

          <div className="overflow-hidden rounded-2xl shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2417.384625132936!2d-60.45334602121145!3d-31.78135841730976!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sar!4v1769713471570!5m2!1ses!2sar"
              className="w-full h-[400px] rounded-2xl shadow-lg"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 px-6 bg-white fade-up">
        <h2 className="text-2xl font-serif mb-4 text-center">
          ¿Nos acompañás en este día tan especial?
        </h2>
        <RsvpForm />
      </section>

    </main>
  );
}
