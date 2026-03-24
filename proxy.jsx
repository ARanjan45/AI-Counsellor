import { NextResponse } from "next/server";
import { stackServerApp } from "./stack/server";

// Rename: middleware → proxy
export async function proxy(request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};