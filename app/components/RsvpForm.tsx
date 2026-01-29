"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [attends, setAttends] = useState<boolean | null>(null);
  const [companions, setCompanions] = useState(0);
  const [food, setFood] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setLoading(true);

    const { error } = await supabase.from("rsvps").insert({
      name,
      attends,
      companions: attends ? companions : null,
      food_restrictions: attends ? food : null,
      comment,
    });

    setLoading(false);

    if (!error) {
      setSuccess(true);
    } else {
      alert("Error al enviar la confirmación");
    }
  };

  if (success) {
    return <p className="text-xl text-green-600">¡Gracias por confirmar! 💚</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Confirmar asistencia</h2>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Nombre y apellido"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mb-3">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            attends === true ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setAttends(true)}
        >
          Sí asisto
        </button>
        <button
          className={`px-4 py-2 rounded ${
            attends === false ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setAttends(false)}
        >
          No puedo asistir
        </button>
      </div>

      {attends && (
        <>
          <input
            type="number"
            className="w-full border p-2 mb-3 rounded"
            placeholder="Acompañantes"
            value={companions}
            onChange={(e) => setCompanions(Number(e.target.value))}
          />

          <textarea
            className="w-full border p-2 mb-3 rounded"
            placeholder="Intolerancias alimentarias"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
        </>
      )}

      <textarea
        className="w-full border p-2 mb-3 rounded"
        placeholder="Comentario"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading || attends === null || !name}
        onClick={submit}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
