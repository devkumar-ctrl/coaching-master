"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AppLink } from "@/components/ui/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  BookOpen,
  Settings,
  Menu,
  ArrowRight,
  Sparkles,
  ChevronDown,
  GraduationCap,
  Cpu,
} from "lucide-react"

import { useSession } from "next-auth/react"
import SignIn from "@/components/auth/sign-in"
import SignOut from "@/components/auth/sign-out"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { cn } from "@/lib/utils"

type CourseMenuItem = {
  title: string
  group: "degree" | "professional"
  partner: string
  badge?: string
}

const COURSE_MENU: CourseMenuItem[] = [
  {
    title: "MS in Computer Science : AI Systems & ML Engineering",
    group: "degree",
    partner: "European- HEA Licensed",
    badge: "Top Rated",
  },
  {
    title: "MS in Computer Science : Cloud & AI Infrastructure Engineering",
    group: "degree",
    partner: "European- HEA Licensed",
    badge: "Popular",
  },
  {
    title: "Professional Certification in Data Science and Agentic AI",
    group: "professional",
    partner: "Vishlesan I-Hub, IIT Patna",
  },
  {
    title: "Professional Certification in Software Development with AI & DevOps",
    group: "professional",
    partner: "Vishlesan I-Hub, IIT Patna",
  },
  {
    title: "Advanced Certification in Data Science and AI",
    group: "professional",
    partner: "NASSCOM",
  },
  {
    title: "Advanced Certification in Software Development and Agentic AI",
    group: "professional",
    partner: "NASSCOM",
  },
]

const PRIMARY_LINKS = [
  { href: "/placements", label: "Placements" },
  { href: "/#workshop", label: "Masterclass" },
  { href: "/notes", label: "Free Practice" },
  { href: "/contact", label: "Hire from us" },
]

const MORE_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/placements#hired", label: "Success Stories" },
  { href: "/#bytes", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact" },
]

const MOBILE_LINKS = [
  { href: "/courses", label: "Courses" },
  ...PRIMARY_LINKS,
  { href: "/about", label: "About us" },
  { href: "/#bytes", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact" },
]

type CourseFilter = "all" | "degree" | "professional"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href.startsWith("/#")) return false
  return pathname.startsWith(href)
}

function CoursesMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<CourseFilter>("all")

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const courses = COURSE_MENU.filter(
    (course) => filter === "all" || course.group === filter
  )

  const tabs: { value: CourseFilter; label: string }[] = [
    { value: "all", label: "All Courses (6)" },
    { value: "degree", label: "Master's Degree (2)" },
    { value: "professional", label: "Professional Certifications (4)" },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm font-medium data-[state=open]:bg-primary/10 data-[state=open]:text-primary [@media(pointer:coarse)]:touch-target"
          aria-label="Browse all courses"
        >
          Courses
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(94vw,760px)] p-4 sm:p-5"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold mr-1">Courses</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter courses">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={filter === tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-fast",
                    "hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    filter === tab.value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">
              Ideal for working professionals and graduates
            </p>
            <p className="text-xs text-muted-foreground">
              Outcomes: 5-40 LPA Job + Masters Degree
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
            {courses.map((course) => (
              <AppLink
                key={course.title}
                href="/courses"
                variant="bare"
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors duration-fast hover:bg-accent focus-visible:bg-accent"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    course.group === "degree"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/15 text-secondary-foreground dark:text-secondary"
                  )}
                  aria-hidden="true"
                >
                  {course.group === "degree" ? (
                    <GraduationCap className="h-4.5 w-4.5" />
                  ) : (
                    <Cpu className="h-4.5 w-4.5" />
                  )}
                </span>
                <span className="min-w-0 space-y-1">
                  {course.badge && (
                    <Badge className="mb-0.5 h-5 px-1.5 text-xs" variant="secondary">
                      {course.badge}
                    </Badge>
                  )}
                  <span className="block text-sm font-medium leading-snug">
                    {course.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {course.partner}
                  </span>
                </span>
              </AppLink>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const getUserDashboardUrl = () => {
    if (!session?.user?.role) return "/dashboard"

    switch (session.user.role) {
      case "COACH":
        return `/dashboard/teacher/${session.user.id}`
      case "STUDENT":
        return `/dashboard/student/${session.user.id}`
      case "ADMIN":
        return "/admin"
      default:
        return "/dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-2 sm:gap-4">
        {/* Logo */}
        <AppLink
          href="/"
          variant="bare"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="AlmaBetter home"
        >
          <span className="inline-flex h-12 w-auto items-center rounded-lg bg-gradient-to-r from-primary/10 to-secondary/20 p-1.5 shadow-sm ring-1 ring-primary/10">
            <img src="/yuva/yuva-logo.webp" alt="" className="h-full w-auto mix-blend-normal" />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-md font-bold tracking-tight text-primary">AlmaBetter</span>
            <span className="text-xs text-muted-foreground">Fast Forward Your Career in AI</span>
          </span>
        </AppLink>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 ml-2">
          <CoursesMenu pathname={pathname} />

          {PRIMARY_LINKS.map((link) => (
            <AppLink
              key={link.href}
              href={link.href}
              variant="nav"
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                isActive(pathname, link.href) && "bg-primary/10 text-primary font-semibold"
              )}
            >
              {link.label}
            </AppLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-sm font-medium [@media(pointer:coarse)]:touch-target"
                aria-label="More navigation options"
              >
                More
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>More</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MORE_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <AppLink href={link.href} variant="bare">
                    {link.label}
                  </AppLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {session?.user && (
            <AppLink
              href={getUserDashboardUrl()}
              variant="nav"
              aria-current={isActive(pathname, getUserDashboardUrl()) ? "page" : undefined}
              className={cn(
                isActive(pathname, getUserDashboardUrl()) &&
                  "bg-primary/10 text-primary font-semibold"
              )}
            >
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              Dashboard
            </AppLink>
          )}
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Mode Toggle - Hidden on mobile to save space */}
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 [@media(pointer:coarse)]:touch-target"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    {session.user?.role && (
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {session.user.role === "COACH" ? "Teacher" :
                         session.user.role === "STUDENT" ? "Student" :
                         session.user.role === "ADMIN" ? "Admin" :
                         session.user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <AppLink href={getUserDashboardUrl()} variant="bare" className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </AppLink>
                </DropdownMenuItem>

                {session.user?.role === "COACH" && (
                  <DropdownMenuItem asChild>
                    <AppLink href="/dashboard/teacher/create-course" variant="bare" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Create course</span>
                    </AppLink>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Mode toggle for mobile */}
                <div className="sm:hidden">
                  <DropdownMenuItem asChild>
                    <div className="flex items-center px-2 py-2">
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="mr-auto">Theme</span>
                      <ModeToggle />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <SignOut />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignIn />
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="ml-0 lg:hidden -ml-2 [@media(pointer:coarse)]:touch-target"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] pr-0">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2 text-left">
                <img src="/yuva/yuva-logo.webp" alt="AlmaBetter" className="h-8 w-auto" />
              </SheetTitle>
            </SheetHeader>

            <nav aria-label="Primary mobile" className="flex flex-col space-y-1 mt-6">
              {MOBILE_LINKS.map((link) => (
                <AppLink
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  variant="bare"
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-accent focus-visible:bg-accent",
                    isActive(pathname, link.href) && "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  <span>{link.label}</span>
                </AppLink>
              ))}

              {session?.user && (
                <AppLink
                  href={getUserDashboardUrl()}
                  variant="bare"
                  className="flex items-center space-x-2 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-accent [@media(pointer:coarse)]:min-h-11"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </AppLink>
              )}

              <Button asChild className="mt-3 w-full justify-between rounded-full">
                <AppLink href="/courses" variant="bare">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Discover All Courses
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
