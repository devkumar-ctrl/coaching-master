"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  GraduationCap,
  UserCheck,
  BarChart3,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import SignOut from "@/components/auth/sign-out"
import { useSession } from "next-auth/react"

const NAV_ITEMS = [
  { number: "01", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { number: "02", label: "Courses", href: "/admin/courses", icon: BookOpen },
  { number: "03", label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { number: "04", label: "Users", href: "/admin/users", icon: Users },
  { number: "05", label: "Faculty", href: "/admin/web/faculty", icon: GraduationCap },
  { number: "06", label: "Teacher Applications", href: "/admin/request", icon: UserCheck },
  { number: "07", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { number: "08", label: "Settings", href: "/admin/settings", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/"
  return pathname.startsWith(href)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-pink-600 text-[10px] font-black text-white">
            YB
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">YuvaBot Lab</span>
            <span className="text-[11px] text-muted-foreground">Admin Console</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {item.number}
                      </span>
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
            <AvatarFallback className="text-xs">
              {session?.user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{session?.user?.name || "Administrator"}</span>
            <span className="truncate text-[11px] text-muted-foreground">{session?.user?.email}</span>
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <SignOut />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}