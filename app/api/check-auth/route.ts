import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) {
      console.error("ADMIN_PASSWORD not set");
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    jwt.verify(token, secret);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Auth check failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
