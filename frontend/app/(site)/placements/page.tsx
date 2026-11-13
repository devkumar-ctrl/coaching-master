"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PLACEMENT_STORIES,
  HIRING_PARTNER_NAMES,
  PARTNER_TESTIMONIALS,
  HEARD_STORY_NAMES,
  type PlacementStory,
} from "@/lib/placements-data";
import {
  Rocket,
  CheckCircle2,
  Download,
  ArrowRight,
  Users,
  Quote,
  TrendingUp,
  FileText,
  GraduationCap,
  UserCheck,
  Target,
  PenLine,
  MessageCircle,
  Sparkles,
  Phone,
  HelpCircle,
  Building2,
} from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function hiredLabel(iso: string) {
  const [year, month] = iso.split("-");
  const monthLabel = MONTHS[Number(month) - 1] ?? month;
  return `${monthLabel} ${year}`;
}

const PLACEMENT_FAQS: { question: string; answer: string }[] = [
  {
    question: "When will the placement process start?",
    answer:
      "Placement support runs through the AlmaX Career Track from day one. Interview opportunities typically begin once you complete the first track — resume, portfolio and mock interviews — after which you are referred to open roles at 1200+ hiring partners.",
  },
  {
    question: "What are competency tests?",
    answer:
      "Competency tests are the screening rounds hiring partners use to shortlist candidates — aptitude, domain and coding assessments. Your preparation includes 100+ coding practice problems and 30+ mock interviews so you walk in ready.",
  },
  {
    question: "How many hiring partners does AlmaBetter have?",
    answer:
      "AlmaBetter works with 1200+ hiring partners, including Amazon, Uber, JP Morgan Chase & Co., Novartis, Accenture, Cognizant, PwC and HSBC, spanning start-ups, mid-size companies and MNCs.",
  },
  {
    question: "What if I want to get a job only in my hometown?",
    answer:
      "Roles are shared across locations, including remote and hybrid openings. Share your preferred city with your placement manager and referrals are matched to roles in your hometown wherever open positions exist.",
  },
  {
    question: "Does AlmaBetter provide job-switching assistance?",
    answer:
      "Yes. Learners who want to switch roles get the same placement support — resume reviews, mock interviews and referrals to 1200+ hiring partners — even after their first offer.",
  },
  {
    question:
      "How do you ensure placements for students who come from non-technical background?",
    answer:
      "Non-technical learners start with foundation modules, then build portfolio projects before entering the same interview pipeline as everyone else. 22 of our 45 most recent placement stories come from non-technical backgrounds.",
  },
];

const SALARY_SPLIT = [
  { label: "< 3 LPA", percentage: 2 },
  { label: "3-5 LPA", percentage: 28 },
  { label: "5-8 LPA", percentage: 46 },
  { label: "> 8 LPA", percentage: 24 },
];

const ORG_SIZE_SPLIT = [
  { label: "Placed in Start-ups", percentage: 25 },
  { label: "Placed in MNCs", percentage: 35 },
  { label: "Placed in Mid-Size Company", percentage: 40 },
];

const GET_HIRED_STEPS = [
  {
    icon: MessageCircle,
    title: "Interview Readiness Lab",
    detail: "30+ 1:1 Mock Interviews & Live Coding",
  },
  {
    icon: PenLine,
    title: "Impact-Driven Resume + Portfolio",
    detail: "ATS-Compliant Job-Winning Resumes",
  },
  {
    icon: UserCheck,
    title: "Dedicated Placement Manager",
    detail: "2X Average CTC with Exclusive Jobs",
  },
  {
    icon: Rocket,
    title: "Personalised Career Journey",
    detail: "100% of 10+ projects",
  },
  {
    icon: GraduationCap,
    title: "Admission to AlmaX",
    detail: "Complete the First Track",
  },
  {
    icon: Target,
    title: "Personalised Career Journey",
    detail: "Unlimited 1:1 Guidance by Experts",
  },
];

function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-fast " +
            "hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 " +
            (value === option
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground")
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function PlacementStoryCard({ story }: { story: PlacementStory }) {
  return (
    <Card className="border-0 shadow-md transition duration-fast hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary"
            aria-hidden="true"
          >
            {story.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-bold leading-tight">{story.name}</p>
            <p className="text-sm text-muted-foreground">{story.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{story.domain}</Badge>
          <Badge variant="outline">{story.background}</Badge>
          <Badge variant="secondary">{story.expBucket}</Badge>
        </div>

        {story.quote ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{story.quote}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2 text-xs">
          <span className="text-muted-foreground">Placed at:</span>
          <span className="font-semibold">{story.placedAt}</span>
          <Badge variant="outline">{story.companyType}</Badge>
          <span className="ml-auto text-muted-foreground">
            Hired {hiredLabel(story.hiredOn)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function HeroSection() {
  const points = [
    "6,000+ Careers Transformed And Counting",
    "4,872 Job Opportunities In 2025 And Counting",
    "Join the Success Story!",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="container mx-auto space-y-6 px-4 py-16 text-center lg:py-24">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Your Success, Our Mission!
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          6000+ Careers Transformed{" "}
          <span className="text-primary">&ndash; Be Next!</span>
        </h1>

        <ul className="mx-auto flex max-w-3xl flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {points.map((point) => (
            <li
              key={point}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/contact">
              <Download className="mr-2 h-5 w-5" />
              Download Placement Report - 2026
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/courses">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "8 LPA", label: "Average Package" },
    { value: "6000+", label: "Happy Placed Students" },
    { value: "40 LPA", label: "Highest Package" },
    { value: "4.6/5", label: "Student Rating" },
    { value: "1200+", label: "Hiring Partners" },
  ];

  return (
    <section className="container mx-auto -mt-4 px-4 pb-4" aria-label="Placement statistics">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-5 text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection() {
  const heroes = useMemo(() => PLACEMENT_STORIES.filter((story) => story.hero), []);
  const [selectedName, setSelectedName] = useState(
    heroes.find((story) => story.name === "Daneyal Ahmad")?.name ?? heroes[0]?.name ?? ""
  );
  const selected =
    heroes.find((story) => story.name === selectedName) ?? heroes[0] ?? null;

  return (
    <section className="container mx-auto px-4 py-14 lg:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Featured Placement Stories</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          The milestones our learners reached — in their own words.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
            <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-base leading-relaxed text-muted-foreground">
              {selected?.quote}
            </p>
            <div className="flex items-center gap-3 border-t border-border/60 pt-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary"
                aria-hidden="true"
              >
                {selected?.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-tight">{selected?.name}</p>
                <p className="text-sm text-muted-foreground">{selected?.role}</p>
              </div>
              <div className="ml-auto text-right text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">{selected?.placedAt}</p>
                <p>Hired {selected ? hiredLabel(selected.hiredOn) : ""}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2"
          role="group"
          aria-label="Choose a featured story"
        >
          {heroes.map((story) => {
            const active = story.name === selectedName;
            return (
              <button
                key={story.name}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedName(story.name)}
                className={
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-fast " +
                  "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 " +
                  (active
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-background")
                }
              >
                <span
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold " +
                    (active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")
                  }
                  aria-hidden="true"
                >
                  {story.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{story.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {story.placedAt}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="bg-muted/40 py-14 dark:bg-muted/10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-bold sm:text-4xl">
              We&apos;ve Trusted Companies as Our Hiring Partners
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            1200+ hiring partners across start-ups, mid-size companies and MNCs.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2" aria-label="Hiring partners">
          {HIRING_PARTNER_NAMES.map((name) => (
            <li
              key={name}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors duration-fast hover:border-primary/40 hover:text-primary sm:text-sm"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HiredSection() {
  const [experience, setExperience] = useState("All");
  const [domain, setDomain] = useState("All");
  const [background, setBackground] = useState("All");

  const experiences = ["All", "0-2 Years", "2-5 Years", "5+ Years"];
  const domains = ["All", "Data Science", "Web Development"];
  const backgrounds = ["All", "Technical", "Non-Technical"];

  const filtered = PLACEMENT_STORIES.filter(
    (story) =>
      (experience === "All" || story.expBucket === experience) &&
      (domain === "All" || story.domain === domain) &&
      (background === "All" || story.background === background)
  );

  return (
    <section id="hired" className="container mx-auto scroll-mt-20 px-4 py-16 lg:py-20">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">See Who Got Hired</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Dreamers, hustlers, and go-getters, our students come from all walks of life.
        </p>
      </div>

      <div className="mb-6 space-y-4 max-w-4xl mx-auto">
        <FilterChips
          label="By Experience"
          options={experiences}
          value={experience}
          onChange={setExperience}
        />
        <FilterChips label="By Domain" options={domains} value={domain} onChange={setDomain} />
        <FilterChips
          label="By Background"
          options={backgrounds}
          value={background}
          onChange={setBackground}
        />
      </div>

      <p className="mb-6 text-center text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {PLACEMENT_STORIES.length} placement stories
      </p>

      {filtered.length === 0 ? (
        <Card className="mx-auto max-w-2xl border-0 shadow-md">
          <CardContent className="space-y-3 p-10 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              No stories match these filters yet. Try a different combination.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExperience("All");
                setDomain("All");
                setBackground("All");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((story) => (
            <PlacementStoryCard key={story.name} story={story} />
          ))}
        </div>
      )}

      <Card className="mt-10 border-0 shadow-md">
        <CardContent className="flex flex-col items-start gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-1 text-lg font-bold">Explore more placement stories</h3>
            <p className="text-sm text-muted-foreground">
              Download our placement report to see hired students and their experiences.
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/contact">
              <Download className="mr-2 h-4 w-4" />
              Download Placement Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function HowWeGetYouHiredSection() {
  const almaXStats = [
    { value: "10+", label: "Projects" },
    { value: "30+", label: "Mock Interviews" },
    { value: "100+", label: "Coding Practice" },
  ];

  return (
    <section className="bg-muted/40 py-16 dark:bg-muted/10 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How We Get You Hired</h2>
          <p className="text-lg text-muted-foreground">
            Your success is our mission &mdash; here&apos;s how we make it happen!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GET_HIRED_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={`${step.title}-${index}`}
                className="border-0 shadow-md transition duration-fast hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 overflow-hidden border-0 shadow-md">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Rocket className="h-8 w-8" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="text-3xl font-bold text-primary">95% Placement Rate</p>
              <p className="text-sm text-muted-foreground">in the AlmaX Career Track</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                03 Months Duration
              </Badge>
              {almaXStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ResumeSection() {
  const stats = [
    { value: "50K+", label: "Resume Created" },
    { value: "80+", label: "ATS Score" },
    { value: "30+", label: "MAANG Templates" },
  ];

  return (
    <section className="container mx-auto px-4 py-16 lg:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <Badge variant="secondary" className="w-fit">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Free
          </Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Create Your Resume with AI</h2>
          <p className="text-lg text-muted-foreground">
            Speed up your job search with AI-driven resume tools, featuring professional
            templates and smart suggestions.
          </p>

          <div className="flex flex-wrap gap-3">
            {["ATS Friendly One-Click Export", "AI Optimized"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>

          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <a
              href="https://grow.almabetter.com/masters-data-science/almax-career-track/supplementary-courses/professional_resume_building_with_almabetter_ds"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="mr-2 h-5 w-5" />
              Claim Free Resume Builder
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalarySection() {
  return (
    <section className="bg-muted/40 py-16 dark:bg-muted/10 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            A Bright Future Awaits You !
          </h2>
          <p className="text-lg text-muted-foreground">
            Ambitious learners, determined hustlers &mdash; with AlmaBetter, the future
            shines brighter.
          </p>
        </div>

        <Card className="mx-auto max-w-3xl border-0 shadow-md">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                % Students Placed in 2025
              </p>
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            <ul className="space-y-5">
              {SALARY_SPLIT.map((band) => (
                <li key={band.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{band.label}</span>
                    <span className="font-semibold text-primary">{band.percentage}%</span>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${band.label}: ${band.percentage}% of students placed`}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-normal"
                      style={{ width: `${band.percentage}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mx-auto mt-6 max-w-3xl border-0 shadow-md">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold">Get a Guaranteed Job!</p>
              <p className="text-sm text-muted-foreground">
                Get ahead of the crowd with AlmaBetter.
              </p>
            </div>
            <Button asChild className="sm:ml-auto">
              <Link href="/auth/signin">
                Register For Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function HeardSection() {
  const heardStories = useMemo(() => {
    const byName = new Map(PLACEMENT_STORIES.map((story) => [story.name, story]));
    return HEARD_STORY_NAMES.map((name) => byName.get(name)).filter(
      (story): story is PlacementStory => Boolean(story)
    );
  }, []);

  return (
    <section className="container mx-auto px-4 py-16 lg:py-20">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Hear from those who Did it
        </h2>
        <p className="text-lg text-muted-foreground">
          Real stories from those who achieved their dreams.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ORG_SIZE_SPLIT.map((item) => (
          <Card key={item.label} className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{item.percentage}%</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {heardStories.map((story) => (
          <Card
            key={story.name}
            className="border-0 shadow-md transition duration-fast hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="flex items-center gap-3 p-5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary"
                aria-hidden="true"
              >
                {story.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold leading-tight">{story.name}</p>
                <p className="truncate text-sm text-muted-foreground">{story.role}</p>
                <p className="truncate text-xs font-medium text-primary">
                  {story.placedAt}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function PartnerVoicesSection() {
  return (
    <section className="bg-muted/40 py-16 dark:bg-muted/10 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Here&apos;s What Our Hiring Partners Say
            </h2>
            <Badge variant="secondary">1200+ Hiring Partners</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            The teams who hire from AlmaBetter, in their own words.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TESTIMONIALS.map((item) => (
            <Card key={item.name} className="border-0 shadow-md">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <Quote className="h-7 w-7 text-primary" aria-hidden="true" />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.quote}
                </p>
                <div className="border-t border-border/60 pt-4">
                  <p className="font-bold leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                  <Badge variant="outline" className="mt-2">
                    {item.company}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidanceSection() {
  const points = [
    "Expert Career Guidance",
    "20+ Free Workshops",
    "100+ Hours of Free Tutorial",
  ];
  const trust = [
    "Trusted by 1 Lakh+ Learners",
    "24/7 Expert available",
    "Trusted Member 5.0 Rating",
    "Trusted Mentors",
  ];

  return (
    <section className="container mx-auto px-4 py-16 lg:py-20">
      <Card className="border-0 shadow-md">
        <CardContent className="space-y-6 p-8 text-center sm:p-12">
          <div className="flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              India&apos;s most trusted career platform
            </p>
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">Get Personalised Guidance</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get real clarity on courses, careers, and what actually fits you
          </p>

          <ul className="flex flex-wrap justify-center gap-4">
            {points.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/contact">
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk To Expert Counsellor
            </Link>
          </Button>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border/60 pt-4">
            {trust.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="container mx-auto scroll-mt-20 px-4 py-16 lg:py-20">
      <div className="mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Got Questions? We&apos;ve Got Answers
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {PLACEMENT_FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Request call Back
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function PlacementsPage() {
  return (
    <main className="pb-4">
      <HeroSection />
      <StatsStrip />
      <FeaturedSection />
      <PartnersSection />
      <HiredSection />
      <HowWeGetYouHiredSection />
      <ResumeSection />
      <SalarySection />
      <HeardSection />
      <PartnerVoicesSection />
      <GuidanceSection />
      <FaqSection />
    </main>
  );
}
