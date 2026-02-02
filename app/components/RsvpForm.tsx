"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { theme, tw } from "@/app/styles/theme";

export default function RsvpForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    asistencia: "si",
    menoresCinco: "0",
    entrecincodiez: "0",
    mayoresdiez: "0",
    restricciones: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("rsvps").insert([
        {
          nombre: formData.nombre,
          apellido: formData.apellido,
          asistencia: formData.asistencia,
          menores_cinco: parseInt(formData.menoresCinco),
          entre_cinco_diez: parseInt(formData.entrecincodiez),
          mayores_diez: parseInt(formData.mayoresdiez),
          restricciones_alimentarias: formData.restricciones || null,
          mensaje: formData.mensaje || null,
        },
      ]);

      if (error) {
        console.error("Error:", error);
        alert("Error al guardar el formulario");
        return;
      }

      setSubmitted(true);
      setSubmittedType(formData.asistencia);
      setTimeout(() => {
        setSubmitted(false);
        setSubmittedType("");
        setFormData({
          nombre: "",
          apellido: "",
          asistencia: "si",
          menoresCinco: "0",
          entrecincodiez: "0",
          mayoresdiez: "0",
          restricciones: "",
          mensaje: "",
        });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const totalAcompanantes = parseInt(formData.menoresCinco) + parseInt(formData.entrecincodiez) + parseInt(formData.mayoresdiez);

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {submitted ? (
        <motion.div
          className={`${theme.backgrounds.success} border-2 p-6 rounded-lg text-center`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {submittedType === "si" && (
            <>
              <p className="text-lg font-semibold">✅ ¡Gracias por confirmar!</p>
              <p className="mt-2">Te esperamos el 22 de Noviembre de 2026.</p>
            </>
          )}
          {submittedType === "no" && (
            <>
              <p className="text-lg font-semibold">💔 Gracias de todas formas</p>
              <p className="mt-2">Te vamos a extrañar en nuestro gran día.</p>
            </>
          )}
          {submittedType === "quizas" && (
            <>
              <p className="text-lg font-semibold">⏰ Gracias por tu interés</p>
              <p className="mt-2">Tienes tiempo hasta 1 mes antes de la boda para confirmar tu asistencia. ¡Sin presiones!</p>
            </>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          {/* Datos Personales */}
          <div>
            <h3 className={`text-xl font-semibold ${theme.text.heading} mb-4`}>Datos Personales</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={tw.inputFocus}
                  placeholder="Tu nombre"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className={tw.inputFocus}
                  placeholder="Tu apellido"
                />
              </motion.div>
            </div>
          </div>

          {/* Asistencia */}
          <div>
            <h3 className={`text-xl font-semibold ${theme.text.heading} mb-4`}>Confirmación de Asistencia</h3>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ¿Podrás asistir? *
              </label>
              <select
                name="asistencia"
                value={formData.asistencia}
                onChange={handleChange}
                className={`${tw.inputFocus} bg-white`}
              >
                <option value="si">Sí, confirmo mi asistencia 🎉</option>
                <option value="no">No puedo asistir 😞</option>
                <option value="quizas">Aún no sé 🤔</option>
              </select>
            </motion.div>
          </div>

          {/* Acompañantes - Solo si confirma asistencia */}
          {formData.asistencia === "si" && (
            <div>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-4`}>Acompañantes</h3>
              <p className="text-sm text-gray-600 mb-4">Especifica la cantidad de personas que te acompañarán</p>
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Menores a 5 años
                  </label>
                  <select
                    name="menoresCinco"
                    value={formData.menoresCinco}
                    onChange={handleChange}
                    className={`${tw.inputFocus} bg-white`}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Entre 5 a 10 años
                  </label>
                  <select
                    name="entrecincodiez"
                    value={formData.entrecincodiez}
                    onChange={handleChange}
                    className={`${tw.inputFocus} bg-white`}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mayores a 10 años
                  </label>
                  <select
                    name="mayoresdiez"
                    value={formData.mayoresdiez}
                    onChange={handleChange}
                    className={`${tw.inputFocus} bg-white`}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </motion.div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Total de acompañantes: <span className="font-semibold">{totalAcompanantes}</span>
              </p>
            </div>
          )}

          {/* Restricciones Alimentarias - Solo si confirma asistencia */}
          {formData.asistencia === "si" && (
            <div>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-4`}>Restricciones Alimentarias</h3>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Tienes alguna restricción dietética o alergia? (ej: celíaco, hipertenso, alérgico a frutos secos, etc.)
                </label>
                <textarea
                  name="restricciones"
                  value={formData.restricciones}
                  onChange={handleChange}
                  rows={3}
                  className={tw.inputFocus}
                  placeholder="Cuéntanos sobre tus restricciones alimentarias o alergias..."
                />
              </motion.div>
            </div>
          )}

          {/* Comentario - Solo si no puede asistir */}
          {formData.asistencia === "no" && (
            <div>
              <h3 className={`text-xl font-semibold ${theme.text.heading} mb-4`}>Mensaje (Opcional)</h3>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Si deseas, déjanos un comentario
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className={tw.inputFocus}
                  placeholder="Déjanos un mensaje..."
                />
              </motion.div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className={`${tw.button} w-full`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Enviando..." : formData.asistencia === "si" ? "Confirmar Asistencia" : formData.asistencia === "no" ? "Enviar" : "Continuar"}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}
