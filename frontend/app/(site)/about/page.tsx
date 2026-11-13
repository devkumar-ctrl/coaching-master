import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  GraduationCap,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  Star,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutUs() {
  const stats = [
    { icon: Users, label: "Careers Transformed", value: "6000+", color: "text-blue-600" },
    { icon: Award, label: "Skilled Learners", value: "24k+", color: "text-green-600" },
    { icon: BookOpen, label: "Industry Projects", value: "500+", color: "text-purple-600" },
    { icon: GraduationCap, label: "Community Members", value: "35,000+", color: "text-orange-600" }
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our teaching methodology to student support."
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Every decision we make is centered around what's best for our students' success and growth."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We maintain the highest standards of honesty, transparency, and ethical conduct."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate our teaching methods and platform to provide the best learning experience."
    }
  ];

  const team = [
    {
      name: "AlmaBetter",
      position: "AI Education · Bengaluru",
      experience: "Degrees, Certifications & Placements",
      image: "/yuva/yuva-logo.webp",
      achievements: ["Partnerships: IIT Patna · NASSCOM · NSDC", "European HEA licensed degrees", "4.9/5 learning experience"]
    },
    
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              Made in Bengaluru, India
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About AlmaBetter
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              India's AI education company, headquartered in Bengaluru — 
              committed to fast-forwarding careers through master&apos;s degrees, IIT Patna & 
              NASSCOM certifications, and placement outcomes across 50+ high-growth AI roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Users className="h-5 w-5 mr-2" />
                Join Our Community
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background mb-4 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Mission & Vision</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We are dedicated to transforming lives through quality education and personalized mentorship.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="text-center pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    To deliver outcome-driven AI education that fast-forwards careers — 
                    pairing a world-class curriculum with placement support, so every 
                    learner lands a role they are proud of.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardHeader className="text-center pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                    <Star className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    To become India&apos;s most trusted AI education platform, globally 
                    recognised for outcomes — 6000+ careers transformed and counting, 
                    powered by IIT Patna, NASSCOM and NSDC partnerships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do and shape our culture.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Meet the visionaries and experts who are driving AlmaBetter towards excellence.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <div className="flex items-center justify-center h-full">
                        <GraduationCap className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.position}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.experience}</p>
                    <div className="space-y-2">
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Your Future in Tech?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of students who have transformed their careers with AlmaBetter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" variant="secondary" className="text-primary">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
