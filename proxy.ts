import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(req: NextRequest) {
  const session = await getSession();
  if (session?.user) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
}

export const config = {
  matcher: ["/signin/:path*", "/signup/:path*"],
};
