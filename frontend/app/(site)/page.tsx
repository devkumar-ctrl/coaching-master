"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Rocket,
  Briefcase,
  Calendar,
  Video,
  Award,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Building2,
  Wrench,
  FlaskConical,
  FileText,
  PlayCircle,
  Library,
  Download,
  Sparkles,
  Target,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Course = {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  level: string;
  deliveryMode: string;
  totalClasses: number;
  image?: string | null;
  enrollmentCount?: number;
  teacher?: { name?: string; image?: string | null } | null;
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <FeaturedCoursesSection />
      <ServicesSection />
      <GallerySection />
      <ResourcesSection />
      <CareerSection />
      <ContactSection />
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
}

function HeroSection() {
  const stats = [
    { value: "5,000+", label: "Students Trained", icon: Users },
    { value: "150+", label: "Partner Companies", icon: Building2 },
    { value: "95%", label: "Placement Rate", icon: Target },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Avatar / Brand image - front (left) */}
          <div className="shrink-0 order-1 hidden lg:block">
            <img
              src="/yuva/avtar-bgremoved.png"
              alt="YuvaBot Lab avatar"
              className="w-full max-w-[380px] h-auto"
            />
          </div>

          {/* Center content - text at mid */}
          <div className="flex-1 order-2 text-center lg:text-left space-y-6 lg:space-y-8">
            <Badge variant="secondary" className="animate-bounce">
              <Sparkles className="h-4 w-4 mr-1" />
              Admissions Open for 2026 Batch
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Innovate with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Future Tech
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              YuvaBot Lab is committed to creating a future where technology is
              accessible, practical, and impactful — through training in IoT,
              Embedded Systems, Robotics, AI, Cyber Security and beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transition-all">
                <Link href="/courses">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base border-2 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t max-w-lg mx-auto lg:mx-0">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                    <stat.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const pillars = [
    {
      icon: Wrench,
      title: "Skill Training",
      description:
        "Industry-oriented training programs in IoT, Robotics, AI, Cyber Security and more with hands-on methodology.",
      image: "/yuva/technical-training.webp",
    },
    {
      icon: Rocket,
      title: "Product Development",
      description:
        "End-to-end technology solutions including IoT devices, embedded systems, and automation solutions.",
      image: "/yuva/product-development.webp",
    },
    {
      icon: Building2,
      title: "Academic Support",
      description:
        "Lab setup, customized training modules, and faculty development programs for educational institutions.",
      image: "/yuva/academic-support.webp",
    },
  ];

  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Empowering Innovation Through Technology
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          YuvaBot Lab Private Limited is a forward-thinking technology company
          dedicated to empowering individuals, institutions, and industries
          through innovation in Electronics, IoT, Embedded Systems, Robotics,
          AI, Cyber Security, and Skill-Based Training.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-44 overflow-hidden">
              <img
                src={pillar.image}
                alt={pillar.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <pillar.icon className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">{pillar.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ProgramCard({
  icon: Icon,
  name,
  tagline,
  audience,
  focusAreas,
  href,
}: {
  icon: typeof BookOpen;
  name: string;
  tagline: string;
  audience: string;
  focusAreas: string[];
  href: string;
}) {
  return (
    <Card className="h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 flex-1 flex flex-col space-y-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm font-medium text-primary mt-1">{tagline}</p>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Who It&apos;s For</p>
          <p className="text-sm text-muted-foreground">{audience}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Focus</p>
          <ul className="grid grid-cols-1 gap-1.5">
            {focusAreas.map((area) => (
              <li key={area} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={href}>
              Know More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramsSection() {
  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Empower Your Future</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three LazySkool pillars built for students, engineers, and
            professionals — from STEM classrooms to job placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgramCard
            icon={BookOpen}
            name="LazySkool Junior"
            tagline="For Schools · Class 1–12"
            audience="NEP-aligned STEM education for school students with hands-on learning, labs & activities."
            focusAreas={[
              "STEM Lab Setup & Robotics Labs",
              "Digital Skill Training",
              "Science & Technology",
              "Financial & Critical Training",
            ]}
            href="/courses"
          />
          <ProgramCard
            icon={Cpu}
            name="LazySkool Skill"
            tagline="For Engineering & Diploma"
            audience="Industry-driven training for B.E./Diploma students and professionals."
            focusAreas={[
              "Embedded Systems & IoT",
              "Data Science / AI",
              "Cyber Security",
              "EV & Solar Design",
            ]}
            href="/courses"
          />
          <ProgramCard
            icon={Briefcase}
            name="LazySkool Career"
            tagline="For Graduates & Professionals"
            audience="Advanced training, placement assistance and career advancement in emerging tech."
            focusAreas={[
              "Placement Support",
              "Industry Certifications",
              "Interview & Resume Preparation",
              "Job Placement Assistance",
            ]}
            href="/courses"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(
          "/api/courses?limit=6&sort=createdAt&order=desc&status=published"
        );
        if (response.ok) {
          const data = await response.json();
          const withIds: Course[] = data.map((course: any) => ({
            ...course,
            id: course.id || course._id,
          }));
          if (active) setCourses(withIds);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-3xl sm:text-4xl font-bold">Popular Training Programs</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hands-on programs in Cyber Security, AI/ML, Data Science, IoT,
          Robotics and more — with live industry projects and placement support.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={course.id || course._id || index} className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <BookOpen className="h-12 w-12 text-primary/60 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium capitalize">
                      {course.category.replace("-", " ")} Course
                    </p>
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">
                    {course.price ? formatPrice(course.price).replace("₹", "") : "Free"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                    {course.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border/50 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{course.totalClasses} classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground capitalize">{course.level.replace("-", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{course.enrollmentCount || 0} enrolled</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all">
                  <Link href={`/courses/${course.id || course._id}`}>
                    Enroll Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/30">
          <Link href="/courses">
            View All Programs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: ShieldCheck,
      title: "Cyber Security Solutions",
      image: "/yuva/cybersecurity.webp",
      points: ["Vulnerability Assessment", "Threat Monitoring", "Incident Response"],
    },
    {
      icon: Cpu,
      title: "Industrial Automation",
      image: "/yuva/industrial-automation.webp",
      points: ["Smart Manufacturing", "Process Automation", "Energy Solutions"],
    },
    {
      icon: GraduationCap,
      title: "STEM Education",
      image: "/yuva/stem-education.webp",
      points: ["Robotics & Coding", "STEM Lab Setup", "Teacher Training"],
    },
    {
      icon: Wrench,
      title: "Skill Training",
      image: "/yuva/training-session.webp",
      points: ["IoT & Embedded", "EV Technology", "Live Projects"],
    },
    {
      icon: Cpu,
      title: "IoT Kits & Hardware",
      image: "/yuva/iot-kits-hardware.webp",
      points: ["Development Boards", "Sensor Modules", "Project Kits"],
    },
    {
      icon: Briefcase,
      title: "Career & Placement",
      image: "/yuva/career-placement.webp",
      points: ["Job Opportunities", "Campus Drives", "Career Support"],
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Comprehensive Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re a student, institution, or industry looking to
            innovate and grow, we have the perfect solution for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <service.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">{service.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const moments = [
    { image: "/yuva/training-session.webp", label: "Hands-on Training Session" },
    { image: "/yuva/robotics-competition.webp", label: "Robotics Competition" },
    { image: "/yuva/lab-setup.webp", label: "STEM Lab Setup" },
  ];

  const galleryStats = [
    { value: "500+", label: "Photos", icon: BookOpen },
    { value: "50+", label: "Videos", icon: PlayCircle },
    { value: "100+", label: "Events", icon: Calendar },
    { value: "25+", label: "Training Sessions", icon: Wrench },
  ];

  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Moments</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Workshops, competitions, lab setups and industry collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {moments.map((moment) => (
          <Card key={moment.label} className="overflow-hidden border-0 shadow-md">
            <div className="relative h-56 overflow-hidden">
              <img
                src={moment.image}
                alt={moment.label}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">{moment.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 max-w-3xl mx-auto">
        {galleryStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResourcesSection() {
  const resources = [
    { icon: FileText, title: "Tech Blogs", description: "Insights on emerging technologies and industry trends" },
    { icon: Wrench, title: "Tutorials", description: "Step-by-step guides for IoT, robotics and programming" },
    { icon: Library, title: "Industry Reports", description: "Market analysis and technology forecasts" },
    { icon: PlayCircle, title: "Video Library", description: "Webinars, project demos and educational content" },
  ];

  const freeResources = [
    "IoT Project Guide",
    "Arduino Cheat Sheet",
    "Robotics Starter Kit",
    "AI Learning Roadmap",
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Resources & Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn at your own pace with our knowledge hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {resources.map((resource) => (
            <Card key={resource.title} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 space-y-3">
                <resource.icon className="h-8 w-8 text-primary" />
                <h3 className="font-bold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Free Resources</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {freeResources.map((name) => (
                <Button key={name} asChild variant="outline" className="justify-between h-auto py-3 text-left">
                  <Link href="/contact">
                    <span>{name}</span>
                    <Download className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CareerSection() {
  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Career Starts Here</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Placement assistance, campus drives and career guidance for students,
          graduates and working professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Find Your Dream Job</h3>
            <p className="text-sm text-muted-foreground">
              Connect with top companies and get personalized placement assistance
              to kickstart your career.
            </p>
            <ul className="space-y-2 text-sm">
              {["Verified job openings and internships", "Resume building and interview prep", "Career guidance and mentorship", "Industry networking opportunities"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full">
              <Link href="/contact">Register for Placement Assistance</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-8 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Host Campus Drives</h3>
            <p className="text-sm text-muted-foreground">
              Partner with us for successful campus recruitment drives with
              industry-ready candidates.
            </p>
            <ul className="space-y-2 text-sm">
              {["Complete recruitment support", "Pre-placement training programs", "Technical aptitude assessments", "Industry partner network"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contact">Register as College</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ContactSection() {
  const channels = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 83403 07574",
      sub: "Mon–Fri, 9AM–6PM",
      href: "tel:+918340307574",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 83403 07574",
      sub: "Instant response",
      href: "https://wa.me/918340307574",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "hr@YuvaBot.com",
      sub: "We respond within 24hrs",
      href: "mailto:hr@YuvaBot.com",
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let&apos;s Build Something Great</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our training programs, services, or need a
            custom solution? Our team is ready to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {channels.map((channel) => (
            <Link key={channel.title} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined}>
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <CardContent className="p-6 space-y-2">
                  <channel.icon className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-bold">{channel.title}</h3>
                  <p className="text-sm font-medium">{channel.value}</p>
                  <p className="text-xs text-muted-foreground">{channel.sub}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="border-0 shadow-md max-w-4xl mx-auto mt-8">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Headquarters</h3>
                <p className="text-sm text-muted-foreground">
                  9/A3 KrishnaPuri Road, Morabadi,<br />
                  Ranchi, Jharkhand 834008, India
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Business hours: Mon–Fri 9AM–6PM · Sat 9AM–2PM
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80">
              <Link href="/contact">
                Send Us a Message
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}