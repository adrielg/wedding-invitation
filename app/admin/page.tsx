import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const isAdmin = (await cookies()).get("admin-auth")?.value;

  if (!isAdmin) {
    redirect("/admin-login");
  }

  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="p-10">
      <button
  onClick={() => supabase.auth.signOut()}
  className="text-sm text-neutral-500 hover:text-black"
>
  Cerrar sesión
</button>
      <h1 className="text-3xl font-bold mb-6">
        Confirmaciones de asistencia
      </h1>

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
