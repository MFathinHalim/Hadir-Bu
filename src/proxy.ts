import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname === "/user/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
    const { payload } = await jwtVerify(token, secret);

    if (payload.isFirstLogin && pathname !== "/change_password") {
      return NextResponse.redirect(new URL("change_password", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/user/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
