// src/proxy.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function proxy(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = new URL(request.url);

  // Protect the dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from seeing the login page
  if (user && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
