import { NextRequest, NextResponse } from "next/server";

// Subdomains that should serve the LMS experience. The LMS lives as a normal
// route at /lms inside this app, so a request to any of these hosts is rewritten
// onto that route (e.g. https://lms.example.com/ -> /lms, /courses -> /lms/courses).
const LMS_SUBDOMAINS = ["lms", "learn"];
const LMS_PREFIX = "/lms";

// Paths that must never be rewritten, otherwise the LMS host would lose access
// to auth, API and Next.js internals.
function isBypassed(pathname: string): boolean {
  return (
    pathname.startsWith(LMS_PREFIX) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next")
  );
}

function isLmsHost(hostname: string): boolean {
  const first = hostname.split(".")[0]?.toLowerCase();
  return LMS_SUBDOMAINS.includes(first);
}

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  if (!isLmsHost(nextUrl.hostname)) {
    return NextResponse.next();
  }

  const pathname = nextUrl.pathname;
  if (isBypassed(pathname)) {
    return NextResponse.next();
  }

  const url = nextUrl.clone();
  url.pathname = pathname === "/" ? LMS_PREFIX : `${LMS_PREFIX}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
