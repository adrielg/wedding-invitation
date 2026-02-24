import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Acceso administrativo",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setError("");
    
    try {
      console.log("Intentando login...");
      
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        setError("Contraseña incorrecta");
        return;
      }

      console.log("Login exitoso, redirigiendo...");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión");
    }
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h1 className="text-2xl font-bold mb-4">
          Acceso privado 🔐
        </h1>

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              login();
            }
          }}
        />

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="bg-black text-white w-full py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}
