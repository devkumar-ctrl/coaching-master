"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  User, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu,
  BookOpen,
  Clock,
  Users,
  BarChart3,
  UserCheck,
  Home,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { useSession } from "next-auth/react"
import SignIn from "@/components/auth/sign-in"
import SignOut from "@/components/auth/sign-out"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Training Programs" },
  { href: "/faculty", label: "Faculty" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href)
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
      <div className="container flex h-16 items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="YuvaBot Lab home">
          <span className="inline-flex h-12 w-auto items-center rounded-xl bg-gradient-to-r from-primary/10 to-secondary/20 p-1.5 shadow-sm ring-1 ring-primary/10">
            <img src="/yuva/yuva-logo.webp" alt="" className="h-full w-auto mix-blend-normal" />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              YuvaBot Lab
            </span>
            <span className="text-xs text-muted-foreground">Learn · Build · Innovate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:underline decoration-primary/40 underline-offset-8 hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    isActive(pathname, link.href) && "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}

            {session?.user && (
              <NavigationMenuItem>
                <Link
                  href={getUserDashboardUrl()}
                  className={cn(
                    "group inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary",
                    isActive(pathname, getUserDashboardUrl()) && "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Mode Toggle - Hidden on mobile to save space */}
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          <Button asChild size="sm" className="hidden md:inline-flex h-9 px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm gap-1.5">
            <Link href="/courses">
              Enroll Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30">
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
                  <Link href={getUserDashboardUrl()} className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
               
                
                {session.user?.role === "COACH" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/teacher/create-course" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Create Course</span>
                    </Link>
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
            <Button variant="ghost" size="sm" className="ml-0 lg:hidden -ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] pr-0">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2 text-left">
                <img src="/yuva/yuva-logo.webp" alt="YuvaBot Lab" className="h-8 w-auto" />
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex flex-col space-y-1 mt-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-accent",
                    isActive(pathname, link.href) && "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {session?.user && (
                <Link
                  href={getUserDashboardUrl()}
                  className="flex items-center space-x-2 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-accent"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              <Link
                href="/courses"
                className="flex items-center justify-between mt-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold py-2.5 px-4 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Enroll Now
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}