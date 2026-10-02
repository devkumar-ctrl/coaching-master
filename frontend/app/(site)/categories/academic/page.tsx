import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  BookOpen, 
  Target,
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Zap,
  Heart,
  Trophy,
  GraduationCap,
  BarChart,
  Video,
  FileText,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Trophy,
      title: "Proven Success Rate",
      description: "95% success rate with over 2000+ successful candidates in the last 5 years",
      stats: "2000+ Success Stories"
    },
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description: "Learn from experienced industry engineers, technology educators, and subject matter experts",
      stats: "150+ Expert Teachers"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Hands-on STEM curriculum with project-based learning and latest industry tools",
      stats: "200+ Courses Available"
    },
    {
      icon: Video,
      title: "Live Interactive Classes",
      description: "Attend live sessions with real-time doubt clearing and interactive discussions",
      stats: "Daily Live Sessions"
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and personalized improvement suggestions",
      stats: "AI-Powered Insights"
    },
    {
      icon: Users,
      title: "Personal Mentorship",
      description: "Get guidance from dedicated mentors who understand your strengths and weaknesses",
      stats: "1:1 Mentoring Available"
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Students Trained", icon: Users },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "200+", label: "Courses Available", icon: BookOpen },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "150+", label: "Expert Faculty", icon: GraduationCap },
    { number: "24/7", label: "Student Support", icon: Clock }
  ];

  const methodology = [
    {
      step: "01",
      title: "Foundation Building",
      description: "Start with strong conceptual foundation covering all basic subjects and fundamentals",
      features: ["Basic concept clearing", "Subject-wise foundation", "Interactive learning"]
    },
    {
      step: "02", 
      title: "Advanced Learning",
      description: "Deep dive into advanced topics with expert guidance and comprehensive study materials",
      features: ["Advanced concepts", "Expert mentorship", "Comprehensive notes"]
    },
    {
      step: "03",
      title: "Practice & Assessment",
      description: "Regular practice through mock tests, assignments and performance evaluation",
      features: ["Mock tests", "Performance analysis", "Weak area identification"]
    },
    {
      step: "04",
      title: "Final Preparation",
      description: "Intensive revision, interview preparation and final strategies for exam success",
      features: ["Intensive revision", "Interview prep", "Success strategies"]
    }
  ];

  const testimonials = [
    {
      name: "Arjun Patel",
      rank: "Tech Pro Student, 2023",
      text: "The structured approach and personal mentorship at YuvaBot Lab made all the difference in my preparation.",
      image: "/testimonials/arjun.jpg"
    },
    {
      name: "Sneha Reddy", 
      rank: "Tech Pro Student, 2023",
      text: "The comprehensive study material and regular mock tests helped me identify and improve my weak areas effectively.",
      image: "/testimonials/sneha.jpg"
    },
    {
      name: "Rahul Sharma",
      rank: "Tech Pro Student, 2023", 
      text: "The faculty's expertise and the interactive live sessions provided the perfect learning environment.",
      image: "/testimonials/rahul.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              #1 Technology Training Company
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Why Choose YuvaBot Lab?
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Discover what makes us the preferred choice for thousands of students and institutions. 
              Your success is our commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Star className="h-5 w-5 mr-2" />
                See Success Stories
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Reasons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Sets Us Apart</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience the difference with our unique approach to technology education.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reasons.map((reason, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                          <reason.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{reason.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{reason.description}</p>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {reason.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Achievements</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Numbers that speak for our commitment to excellence and student success.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">{achievement.number}</h3>
                    <p className="text-muted-foreground text-sm">{achievement.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Methodology */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Proven Methodology</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A systematic 4-step approach that has helped thousands of students achieve success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {methodology.map((step, index) => (
                <Card key={index} className="border-0 shadow-xl relative">
                  <div className="absolute -top-6 left-6">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <CardContent className="p-6 pt-10">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Hear from our toppers who achieved their dreams with YuvaBot Lab.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-primary font-medium">{testimonial.rank}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The YuvaBot Lab Difference</h2>
              <p className="text-lg text-muted-foreground">
                What makes us unique in the competitive world of technology education.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Heart className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">Student-Centric Approach</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We believe every student is unique. Our personalized approach ensures that each student 
                        receives the attention and guidance they need to succeed. From individual doubt clearing 
                        sessions to customized study plans, everything is designed keeping the student at the center.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Zap className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">Cutting-Edge Technology</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our platform leverages the latest technology to provide an immersive learning experience. 
                        From AI-powered performance analytics to interactive virtual classrooms, we ensure that 
                        technology enhances your learning journey at every step.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">Success Guarantee</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We stand behind our teaching methodology with confidence. Our premium plans come with a 
                        success guarantee - if you don't clear the exam following our complete program, we'll 
                        provide additional support at no extra cost until you succeed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of successful students who chose YuvaBot Lab for their technology journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" variant="secondary" className="text-primary">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Courses
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5 mr-2" />
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
