"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignOutButton from "../components/SignOutButton";
import * as XLSX from "xlsx"; 

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

    const exportToExcel = () => {
    if (!data || data.length === 0) return;

    const rows = data.map((rsvp) => ({
      Nombre: rsvp.nombre,
      Apellido: rsvp.apellido,
      Asiste:
        rsvp.asistencia === "si"
          ? "Sí"
          : rsvp.asistencia === "no"
          ? "No"
          : "Quizás",
      "Menores a 5 años": rsvp.menores_cinco,
      "Entre 5 y 10 años": rsvp.entre_cinco_diez,
      "Mayores a 10 años": rsvp.mayores_diez,
      "Restricciones alimentarias": rsvp.restricciones_alimentarias ?? "",
      Comentario: rsvp.mensaje ?? "",
      "Fecha creación": new Date(rsvp.created_at).toLocaleString("es-AR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVP");
    XLSX.writeFile(workbook, "confirmaciones.xlsx");
  };


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
      
      <button
        onClick={exportToExcel}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Exportar a Excel
      </button>

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
            <p><strong>Nombre:</strong> {rsvp.nombre}</p>
            <p><strong>Apellido:</strong> {rsvp.apellido}</p>
            <p>
              <strong>Asiste:</strong>{" "}
              {rsvp.asistencia === "si" ? "Sí" : rsvp.asistencia === "no" ? "No" : "Quizás"}
            </p>

            {rsvp.asistencia && (
              <>
                <p><strong>Menores a 5 años:</strong> {rsvp.menores_cinco}</p>
                <p><strong>Entre 5 y 10 años:</strong> {rsvp.entre_cinco_diez}</p>
                <p><strong>Mayores a 10 años:</strong> {rsvp.mayores_diez}</p>
                <p>
                  <strong>Restricciones Alimentarias:</strong>{" "}
                  {rsvp.restricciones_alimentarias || "—"}
                </p>
              </>
            )}

            {rsvp.mensaje && (
              <p><strong>Comentario:</strong> {rsvp.mensaje}</p>
            )}
          </div>
        ))}
      </div>
      
    </main>
  );
}

