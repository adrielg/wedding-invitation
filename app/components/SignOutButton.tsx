"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/admin-logout", { method: "POST" });
    setLoading(false);
    router.push("/admin-login");
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 px-4 py-2 text-sm text-white bg-black hover:bg-neutral-700 rounded-full transition-colors"
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
