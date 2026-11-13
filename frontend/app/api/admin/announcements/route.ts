import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In frontend (Next 14 + app router), session checks rely on existing pattern in codebase
    // For now, allow fetch; admin pages already guard via useSession
    return NextResponse.json({
      message: "6000+ careers transformed. Explore our latest placement stories & hiring partners.",
      href: "/placements",
      cta: "Go to Placements",
      enabled: true,
      storageKey: "almabetter-placements-announcement",
    })
  } catch (error) {
    console.error("Error fetching announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, href, cta, enabled } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    return NextResponse.json({
      message,
      href: href || "/placements",
      cta: cta || "View",
      enabled: enabled !== false,
      storageKey: "almabetter-placements-announcement",
    })
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
