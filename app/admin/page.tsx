"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir directamente al dashboard
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Redirigiendo al panel de administración...</p>
    </main>
  );
}

