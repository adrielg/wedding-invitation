"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignOutButton from "../components/SignOutButton";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar autenticación
        const response = await fetch("/api/check-auth");
        if (!response.ok) {
          router.push("/admin-login");
          return;
        }

        // Obtener datos de Supabase
        const result = await supabase
          .from("rsvps")
          .select("*")
          .order("created_at", { ascending: false });

        if (result.error) {
          setError(result.error.message);
        } else {
          setData(result.data || []);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);


  if (loading) {
    return (
      <main className="p-10">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <SignOutButton />
      <h1 className="text-3xl font-bold mb-6">
        Confirmaciones de asistencia
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {data?.map((rsvp) => (
          <div
            key={rsvp.id}
            className="border p-4 rounded-lg bg-white shadow"
          >
            <p><strong>Nombre:</strong> {rsvp.name}</p>
            <p>
              <strong>Asiste:</strong>{" "}
              {rsvp.attends ? "Sí" : "No"}
            </p>

            {rsvp.attends && (
              <>
                <p><strong>Acompañantes:</strong> {rsvp.companions}</p>
                <p>
                  <strong>Comida:</strong>{" "}
                  {rsvp.food_restrictions || "—"}
                </p>
              </>
            )}

            {rsvp.comment && (
              <p><strong>Comentario:</strong> {rsvp.comment}</p>
            )}
          </div>
        ))}
      </div>
      
    </main>
  );
}
