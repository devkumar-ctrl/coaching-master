import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Heart, 
  Globe, 
  Award,
  CheckCircle,
  Mail,
  Phone,
  Building
} from "lucide-react";
import Link from "next/link";

export default function CareerPage() {
  const openPositions = [
    {
      title: "Senior Cyber Security Trainer",
      type: "Full-time",
      location: "Ranchi / Hybrid",
      experience: "5+ years",
      description: "Lead our Cyber Security training programs and mentor students with comprehensive practical knowledge and teaching expertise."
    },
    {
      title: "IoT & Embedded Systems Specialist",
      type: "Full-time",
      location: "Ranchi / Hybrid",
      experience: "3+ years",
      description: "Design and deliver IoT, hardware and embedded-systems curriculum, and lead engineering lab projects."
    },
    {
      title: "Content Development Manager",
      type: "Full-time",
      location: "Ranchi / Hybrid",
      experience: "4+ years",
      description: "Oversee creation of course materials, projects, and digital content for all technology programs."
    },
    {
      title: "Student Counselor",
      type: "Full-time",
      location: "Ranchi / Hybrid",
      experience: "2+ years",
      description: "Guide students through their technology journey, provide career counseling, and support their academic growth."
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: "Competitive Salary",
      description: "Industry-leading compensation packages with performance bonuses"
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Health Benefits",
      description: "Comprehensive medical insurance for you and your family"
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      title: "Learning & Development",
      description: "Continuous professional development and training opportunities"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Flexible Hours",
      description: "Work-life balance with flexible working arrangements"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Recognition",
      description: "Regular appreciation and recognition programs for outstanding performance"
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Remote Options",
      description: "Hybrid working model with remote collaboration tools"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl sm:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Shape the future of technology education and help create tomorrow's innovators
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
        {/* Why Join Us */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Why Work With Us?</CardTitle>
            <CardDescription className="text-lg">
              Be part of a mission that transforms lives and builds the nation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Meaningful Impact</h3>
                <p className="text-muted-foreground">
                  Make a real difference in students' lives and contribute to nation-building
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Growth Opportunities</h3>
                <p className="text-muted-foreground">
                  Advance your career with continuous learning and leadership opportunities
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Collaborative Culture</h3>
                <p className="text-muted-foreground">
                  Work with passionate educators and experts in a supportive environment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Employee Benefits</CardTitle>
            <CardDescription className="text-lg">
              We take care of our team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Current Openings</CardTitle>
            <CardDescription className="text-lg">
              Join our growing team of education professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div key={index} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <p className="text-muted-foreground mb-3">{position.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {position.type}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {position.experience}
                        </Badge>
                      </div>
                    </div>
                    <Button className="w-full lg:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Application Process</CardTitle>
            <CardDescription className="text-lg">
              Simple steps to join our team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Apply Online</h3>
                <p className="text-muted-foreground text-sm">
                  Submit your application through our website
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold">Initial Screening</h3>
                <p className="text-muted-foreground text-sm">
                  We review your profile and qualifications
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold">Interview Process</h3>
                <p className="text-muted-foreground text-sm">
                  Technical and cultural fit assessment
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="font-semibold">Welcome Aboard</h3>
                <p className="text-muted-foreground text-sm">
                  Onboarding and integration into our team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Careers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Apply?</CardTitle>
            <CardDescription className="text-lg">
              Don't see a perfect match? We'd still love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">HR Department</p>
                    <p className="text-muted-foreground">9/A3 KrishnaPuri Road, Morabadi, Ranchi - 834008</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Career Helpline</p>
                    <p className="text-muted-foreground">+91 83403 07574</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Send Resume</p>
                    <p className="text-muted-foreground">hr@YuvaBot.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-4">
                <Button className="w-full" size="lg">
                  Send Your Resume
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  General Inquiry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
