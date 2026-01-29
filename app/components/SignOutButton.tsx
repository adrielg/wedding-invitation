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
      className="text-sm text-neutral-500 hover:text-black"
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
