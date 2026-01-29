import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import SignOutButton from "../components/SignOutButton";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = (await cookies()).get("admin-auth")?.value;

  if (!isAdmin) {
    redirect("/admin-login");
  }

const { data = [] } = await supabaseServer
  .from("rsvps")
  .select("*")
  .order("created_at", { ascending: false });


  return (
    <main className="p-10">
      <SignOutButton />
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
