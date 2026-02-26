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
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:text-gray-300 hover:border-gray-600 rounded-lg transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
