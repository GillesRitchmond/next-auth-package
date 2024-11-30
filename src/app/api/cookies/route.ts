// app/api/cookies/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("__Secure-next-auth.session-token")?.value;

  return NextResponse.json({ sessionToken });
}