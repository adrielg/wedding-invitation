import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin-auth", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 4, // 4 horas
  });

  return res;
}
