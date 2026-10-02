import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border dark:border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/yuva/yuva-logo.webp" alt="YuvaBot Lab" className="h-10 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering innovation through technology education, industrial solutions, and career development. Building the future of tech together.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://www.youtube.com/" target="_blank" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </Link>
              <Link href="https://www.facebook.com/" target="_blank" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="https://x.com/" target="_blank" aria-label="X (Twitter)">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                About Us
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Training Programs
              </Link>
              <Link href="/faculty" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Faculty
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cyber Security Solutions
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Industrial Automation
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                STEM Education
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Skill Training
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                IoT Kits & Hardware
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Career & Placement
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">
                  9/A3 KrishnaPuri Road, Morabadi,<br />
                  Ranchi, Jharkhand 834008
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <Link href="tel:+918340307574" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91 83403 07574
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <Link href="mailto:hr@YuvaBot.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  hr@YuvaBot.com
                </Link>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Mon–Fri: 9AM–6PM · Sat: 9AM–2PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-sm">
            © {year} YuvaBot Lab Private Limited. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}