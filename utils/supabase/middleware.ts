import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !["/login", "/register", "/reset-password", "/forgot-password"].some((url) =>
      request.nextUrl.pathname.startsWith(url)
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
