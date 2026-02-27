"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [eventsVisible, setEventsVisible] = useState(false);

  useEffect(() => {
    document.title = "Reservá la Fecha — Invitaciones Digitales";
    const faviconLink =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    faviconLink.type = "image/svg+xml";
    faviconLink.rel = "icon";
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💌</text></svg>`;
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }
    requestAnimationFrame(() => setVisible(true));

    // Intersection Observer para Features y Events
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "features") setFeaturesVisible(true);
            if (entry.target.id === "events") setEventsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featuresEl = document.getElementById("features");
    const eventsEl = document.getElementById("events");
    if (featuresEl) observer.observe(featuresEl);
    if (eventsEl) observer.observe(eventsEl);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ── Background effects ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* ── Hero ── */}
      <section
        className={`relative z-10 max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-300">Invitaciones digitales para eventos únicos</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Tu evento merece una
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              invitación perfecta
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Creamos invitaciones digitales elegantes con confirmación de asistencia 
            integrada. Sin complicaciones, con resultados increíbles.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2.5 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              Ver planes y precios
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              href="/e/demo"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white px-6 py-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              Ver demo
            </Link>
          </div>

          <p className="text-xs text-gray-600">
            ¿Recibiste una invitación? Accedé usando el link que te enviaron.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className={`relative z-10 max-w-6xl mx-auto px-6 pb-24 transition-all duration-1000 ${
          featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" /></svg>
              ),
              title: "Diseño a medida",
              desc: "Cada invitación refleja la personalidad de tu evento con colores y estilos únicos.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
              ),
              title: "100% Mobile",
              desc: "Pensado para celulares. Tus invitados confirman asistencia en segundos.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
              ),
              title: "Panel de control",
              desc: "Seguí las confirmaciones en tiempo real y exportá todo a Excel.",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
              ),
              title: "Para todo evento",
              desc: "Casamientos, XV años, cumpleaños, baby showers, corporativos y más.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof / Event types ── */}
      <section
        id="events"
        className={`relative z-10 max-w-6xl mx-auto px-6 pb-24 transition-all duration-1000 ${
          eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Cada evento es <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">único</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-10">
            Nos adaptamos a lo que necesites. Cada detalle pensado para que tu celebración sea inolvidable.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { emoji: "💍", label: "Casamientos" },
              { emoji: "👑", label: "XV Años" },
              { emoji: "🎂", label: "Cumpleaños" },
              { emoji: "🍼", label: "Baby Shower" },
              { emoji: "🎓", label: "Graduaciones" },
              { emoji: "🏢", label: "Corporativos" },
            ].map((type) => (
              <div
                key={type.label}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-4 px-3 hover:border-gray-600 hover:bg-gray-800 transition-all group"
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{type.emoji}</span>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section
        className={`relative z-10 max-w-6xl mx-auto px-6 pb-20 transition-all duration-1000 delay-[400ms] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">¿Listo para crear tu invitación?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2.5 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              Ver planes y precios
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <a
              href="https://wa.me/5493434386611?text=Hola!%20Me%20interesa%20crear%20una%20invitación%20digital%20para%20mi%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white px-6 py-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-gray-950/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* Columna 1 — Marca */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Reservá la Fecha</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Plataforma integral para organizar tus eventos y gestionar confirmaciones de manera simple y elegante.
              </p>
            </div>
            {/* Columna 2 — Producto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Producto</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Funcionalidades</a></li>
                <li><a href="#events" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Tipos de evento</a></li>
                <li><Link href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Planes y precios</Link></li>
                <li><Link href="/admin-login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Acceso administrador</Link></li>
              </ul>
            </div>
            {/* Columna 3 — Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-xs text-gray-500">Términos y condiciones</span></li>
                <li><span className="text-xs text-gray-500">Política de privacidad</span></li>
              </ul>
            </div>
          </div>
          {/* Línea separadora + copyright */}
          <div className="border-t border-gray-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-600">© {new Date().getFullYear()} Reservá la Fecha. Todos los derechos reservados.</span>
            <span className="text-xs text-gray-700">Hecho con ♥ en Argentina</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
