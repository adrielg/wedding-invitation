"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EventAdminLoginPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [eventName, setEventName] = useState<string>("");

  // Si ya tiene token, redirigir al panel directamente
  useEffect(() => {
    const token = localStorage.getItem(`event_auth_${slug}`);
    if (token) {
      router.replace(`/e/${slug}/admin`);
    } else {
      setChecking(false);
    }
  }, [slug, router]);

  useEffect(() => {
    document.title = "Acceso - Panel del Evento";

    const faviconLink =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    faviconLink.type = "image/svg+xml";
    faviconLink.rel = "icon";
    faviconLink.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>`;

    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(faviconLink);
    }

    const fetchEventName = async () => {
      try {
        const response = await fetch(`/api/events/by-slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setEventName(data.name);
          document.title = `Acceso - ${data.name}`;
        }
      } catch (err) {
        console.error("Error al cargar evento:", err);
      }
    };

    fetchEventName();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Ingresá una contraseña");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/events/by-slug/${slug}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        throw new Error("Contraseña incorrecta");
      }

      const { token } = await response.json();
      localStorage.setItem(`event_auth_${slug}`, token);
      router.push(`/e/${slug}/admin`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-500 text-sm">Verificando acceso...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="w-full max-w-sm relative animate-[scaleIn_0.3s_ease-out]">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5 mx-auto">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Panel del Evento
            </h1>
            {eventName ? (
              <p className="text-gray-400 text-sm mt-1">{eventName}</p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">Ingresá tu contraseña para continuar</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3.5 py-2.5 rounded-lg mb-5 text-sm animate-[slideUp_0.2s_ease-out]">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-gray-600 transition-all placeholder:text-gray-600"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Esta contraseña te fue proporcionada para gestionar tu evento
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-gray-900 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                "Acceder al Panel"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-5">
          <a
            href={`/e/${slug}`}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al evento
          </a>
        </div>
      </div>
    </main>
  );
}
