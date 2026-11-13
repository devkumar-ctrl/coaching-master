import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Announcements - Admin",
  description: "Manage site announcements",
}

export default function AnnouncementsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
