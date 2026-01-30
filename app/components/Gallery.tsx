"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const photos = [
    { id: 1, src: "/photos/1.jpg", alt: "Foto 1" },
    { id: 2, src: "/photos/2.jpg", alt: "Foto 2" },
    { id: 3, src: "/photos/3.jpg", alt: "Foto 3" },
    { id: 4, src: "/photos/4.jpg", alt: "Foto 4" },
    { id: 5, src: "/photos/5.jpg", alt: "Foto 5" },
    { id: 6, src: "/photos/6.jpg", alt: "Foto 6" },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-serif font-bold text-center mb-16 text-rose-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Galería
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layoutId={`photo-${photo.id}`}
              onClick={() => setSelectedId(photo.id)}
              className="cursor-pointer relative h-64 bg-gray-200 rounded-lg overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
              <p className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Ver
              </p>
            </motion.div>
          ))}
        </motion.div>

        {selectedId && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="relative max-w-2xl w-full h-96 bg-white rounded-lg"
              layoutId={`photo-${selectedId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 text-2xl text-gray-600 z-10"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
