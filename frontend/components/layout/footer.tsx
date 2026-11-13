import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { AppLink } from "@/components/ui/link"

const COMPANY_LINKS = [
  { href: "/placements#hired", label: "Success Stories" },
  { href: "/contact", label: "Hire From Us" },
  { href: "/footer/career", label: "Careers" },
]

const COURSE_LINKS = [
  "MS in Computer Science : AI Systems & ML Engineering",
  "MS in Computer Science : Cloud & AI Infrastructure Engineering",
  "Professional Certification in Data Science and Agentic AI",
  "Professional Certification in Software Development with AI & DevOps",
  "Advanced Certification in Data Science and AI",
  "Advanced Certification in Software Development and Agentic AI",
]

const RESOURCE_LINKS = [
  { href: "/#bytes", label: "Blog" },
  { href: "/#workshop", label: "Events" },
  { href: "/placements", label: "Placements" },
  { href: "/notes", label: "Online Compilers" },
]

const JOIN_LINKS = [
  { href: "/auth/signin", label: "Sign Up" },
  { href: "/contact", label: "Become A Coach" },
  { href: "/auth/signin", label: "Coach Login" },
]

const POLICY_LINKS = [
  { href: "/privacy", label: "Privacy Statement" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border dark:border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {/* Brand + Contact */}
          <div className="space-y-4">
            <img src="/yuva/yuva-logo.webp" alt="AlmaBetter" className="h-10 w-auto" />
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <AppLink href="mailto:admissions@almabetter.com" variant="muted">
                  admissions@almabetter.com
                </AppLink>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <AppLink href="tel:+918046008400" variant="muted">08046008400</AppLink>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-muted-foreground">
                  Official Address
                  <br />
                  4th floor, 133/2, Janardhan Towers, Residency Road,
                  <br />
                  Bengaluru, Karnataka, 560025
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                <AppLink href="https://www.facebook.com/AlmaBetterOfficial" external variant="bare" aria-label="Facebook" className="touch-target inline-flex items-center justify-center rounded-md hover:bg-accent">
                  <Facebook className="h-4 w-4" />
                </AppLink>
                <AppLink href="https://www.instagram.com/almabetter/" external variant="bare" aria-label="Instagram" className="touch-target inline-flex items-center justify-center rounded-md hover:bg-accent">
                  <Instagram className="h-4 w-4" />
                </AppLink>
                <AppLink href="https://www.linkedin.com/company/67755156/" external variant="bare" aria-label="LinkedIn" className="touch-target inline-flex items-center justify-center rounded-md hover:bg-accent">
                  <Linkedin className="h-4 w-4" />
                </AppLink>
                <AppLink href="https://twitter.com/AlmaBetter" external variant="bare" aria-label="Twitter" className="touch-target inline-flex items-center justify-center rounded-md hover:bg-accent">
                  <Twitter className="h-4 w-4" />
                </AppLink>
                <AppLink href="https://www.youtube.com/channel/UCg6q42xcuCK6zu-zG4qOXQQ" external variant="bare" aria-label="YouTube" className="touch-target inline-flex items-center justify-center rounded-md hover:bg-accent">
                  <Youtube className="h-4 w-4" />
                </AppLink>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <nav aria-label="Footer company links" className="flex flex-col space-y-2">
              {COMPANY_LINKS.map((link) => (
                <AppLink key={link.label} href={link.href} variant="muted" className="text-sm">
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Courses</h3>
            <nav aria-label="Footer course links" className="flex flex-col space-y-2">
              {COURSE_LINKS.map((title) => (
                <AppLink key={title} href="/courses" variant="muted" className="text-sm">
                  {title}
                </AppLink>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <nav aria-label="Footer resource links" className="flex flex-col space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <AppLink key={link.label} href={link.href} variant="muted" className="text-sm">
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>

          {/* Join AlmaBetter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Join AlmaBetter</h3>
            <nav aria-label="Footer join links" className="flex flex-col space-y-2">
              {JOIN_LINKS.map((link) => (
                <AppLink key={link.label} href={link.href} variant="muted" className="text-sm">
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>
            <nav aria-label="Footer policy links" className="flex flex-col space-y-2">
              {POLICY_LINKS.map((link) => (
                <AppLink key={link.label} href={link.href} variant="muted" className="text-sm">
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-sm">
            Made with ❤ in Bengaluru, India
          </p>
          <p className="text-muted-foreground text-sm">
            &copy; {year} AlmaBetter
          </p>
        </div>
      </div>
    </footer>
  )
}
