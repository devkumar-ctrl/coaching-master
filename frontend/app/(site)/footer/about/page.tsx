import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Star, 
  Trophy, 
  Heart, 
  Globe, 
  CheckCircle, 
  Lightbulb,
  GraduationCap,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About YuvaBot Labs
            </h1>
            <p className="text-xl sm:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Empowering the next generation of engineers, creators, and problem solvers through practical, expert-led technology education
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To deliver high-quality, practical, and affordable technical education that 
                combines academic excellence with hands-on, industry-relevant training,
                empowering creators, engineers, and problem solvers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To become a leading technology and innovation hub, creating ethical, skilled, 
                and forward-thinking engineers and educators who will shape the future of technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Why Choose Us?</CardTitle>
            <CardDescription className="text-lg">
              Discover what makes our coaching exceptional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Expert Faculty</h3>
                <p className="text-muted-foreground">
                  Learn from industry experts and subject matter professionals with years of experience
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Comprehensive Curriculum</h3>
                <p className="text-muted-foreground">
                  Hands-on, project-based curriculum in IoT, Robotics, AI and emerging technologies
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Proven Results</h3>
                <p className="text-muted-foreground">
                  Consistent track record of producing successful candidates across all services
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Personal Mentorship</h3>
                <p className="text-muted-foreground">
                  Individual attention and guidance to help you overcome challenges
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Online & Offline</h3>
                <p className="text-muted-foreground">
                  Flexible learning options with live classes and recorded sessions
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Student-Centric Approach</h3>
                <p className="text-muted-foreground">
                  Every program is designed keeping student success and well-being in mind
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Achievements */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Our Achievements</CardTitle>
            <CardDescription className="text-lg">
              Numbers that speak for our excellence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <p className="text-muted-foreground">Successful Candidates</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">15+</div>
                <p className="text-muted-foreground">Years of Experience</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">95%</div>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">5000+</div>
                <p className="text-muted-foreground">Happy Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Get in Touch</CardTitle>
            <CardDescription className="text-lg">
              Ready to start your tech journey with us?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Visit Our Campus</p>
                    <p className="text-muted-foreground">9/A3 KrishnaPuri Road, Morabadi, Ranchi - 834008</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-muted-foreground">+91 83403 07574</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-muted-foreground">info@YuvaBot.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-4">
                <Link href="/contact">
                  <Button className="w-full" size="lg">
                    Contact Us Today
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" className="w-full" size="lg">
                    Explore Our Courses
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
