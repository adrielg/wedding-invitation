import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Panel de administración",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) {
    redirect("/admin-login");
  }

  try {
    jwt.verify(token, process.env.ADMIN_PASSWORD!);
  } catch {
    redirect("/admin-login");
  }

  return <>{children}</>;
}