import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Target,
  Award,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  FileText,
  Video,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function CareerDevelopment() {
  const careerPaths = [
    {
      title: "Cyber Security Analyst",
      description: "Protect organisations from threats as a certified security professional",
      duration: "6-8 months training",
      opportunities: "100K+ openings in India",
      skills: ["Ethical Hacking", "Network Security", "Risk Assessment", "Incident Response"],
      icon: Building,
      color: "bg-blue-500"
    },
    {
      title: "Data Scientist & AI Engineer",
      description: "Build intelligent systems and drive decisions with data",
      duration: "8-10 months training",
      opportunities: "150K+ openings in India",
      skills: ["Machine Learning", "Python", "Statistics", "Model Deployment"],
      icon: Briefcase,
      color: "bg-green-500"
    },
    {
      title: "Full Stack Developer",
      description: "Design and build modern web applications end to end",
      duration: "6-8 months training",
      opportunities: "200K+ openings in India",
      skills: ["JavaScript", "React", "Node.js", "Databases"],
      icon: Award,
      color: "bg-orange-500"
    },
    {
      title: "IoT & Embedded Engineer",
      description: "Create connected devices and intelligent hardware systems",
      duration: "6-8 months training",
      opportunities: "120K+ openings in India",
      skills: ["Embedded C", "Circuit Design", "Sensors", "Cloud Integration"],
      icon: GraduationCap,
      color: "bg-purple-500"
    }
  ];

  const developmentPrograms = [
    {
      title: "Career Launch Program",
      description: "Prepare for high-demand technology roles with expert guidance",
      modules: [
        "Technical Interviews",
        "Portfolio Building",
        "Resume & LinkedIn Optimization",
        "Freelancing Fundamentals"
      ],
      duration: "3 months",
      icon: Users
    },
    {
      title: "Industrial Automation",
      description: "Understand automation systems and smart-industry solutions",
      modules: [
        "PLC & SCADA Basics",
        "IoT Dashboard Design",
        "Robotics Fundamentals",
        "Manufacturing Systems"
      ],
      duration: "4 months", 
      icon: FileText
    },
    {
      title: "Placement Support",
      description: "Comprehensive interview preparation and job referral network",
      modules: [
        "Mock Interviews",
        "Personality Development",
        "Industry Expert Sessions",
        "Comms & Confidence"
      ],
      duration: "2 months",
      icon: MessageCircle
    },
    {
      title: "Professional Skills",
      description: "Essential skills for career advancement in the tech industry",
      modules: [
        "Time Management",
        "Stress Management", 
        "Analytical Thinking",
        "Technical Documentation"
      ],
      duration: "2 months",
      icon: Lightbulb
    }
  ];

  const mentors = [
    {
      name: "Arjun Verma",
      designation: "Cyber Security Consultant",
      experience: "12+ years in InfoSec",
      specialization: "Ethical Hacking & VAPT",
      achievements: ["CEH & OSCP Certified", "Led 200+ security audits", "Award for Excellence"]
    },
    {
      name: "Kavya Reddy", 
      designation: "AI Research Lead",
      experience: "10+ years in AI/ML",
      specialization: "Machine Learning & NLP",
      achievements: ["Ph.D. in AI", "Published 15+ Papers", "Industry Thought Leader"]
    },
    {
      name: "Rahul Sharma",
      designation: "Senior Full Stack Engineer",
      experience: "9+ years in Web Dev",
      specialization: "MERN & Cloud",
      achievements: ["Ex-Product Engineer", "Built 50+ Products", "AWS Certified"]
    }
  ];

  const successStories = [
    {
      name: "Aadhya Singh",
      achievement: "Cyber Security Analyst, Bengaluru",
      year: "2023",
      rank: "Offered ₹8.5 LPA",
      story: "From a small town to a top security team, YuvaBot Lab helped me realize my dream of a tech career.",
      currentRole: "Security Analyst, TCS"
    },
    {
      name: "Rohit Sharma",
      achievement: "Full Stack Developer, Pune", 
      year: "2023",
      rank: "Offered ₹7 LPA", 
      story: "The hands-on training and mentorship at YuvaBot Lab prepared me not just for the interview but for real-world challenges.",
      currentRole: "Software Engineer, Infosys"
    },
    {
      name: "Priyanka Gupta",
      achievement: "Data Analyst, Hyderabad",
      year: "2022",
      rank: "Offered ₹6.5 LPA",
      story: "The project-based approach and industry mentorship helped me excel in data science interviews.",
      currentRole: "Data Analyst, Accenture"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              Career Excellence Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Career Development & Growth
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Shape your future with our comprehensive career development programs. 
              Build the skills, knowledge, and confidence needed for success in public service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <TrendingUp className="h-5 w-5 mr-2" />
                Explore Career Paths
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Calendar className="h-5 w-5 mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Career Opportunities</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore diverse career paths in India's thriving technology industry.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {careerPaths.map((path, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${path.color} rounded-full flex items-center justify-center`}>
                        <path.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{path.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{path.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {path.duration}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Target className="h-4 w-4 mr-2 text-primary" />
                            {path.opportunities}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {path.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button size="sm" className="mt-2">
                          Learn More <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Development Programs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Development Programs</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive skill development programs designed for career advancement.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {developmentPrograms.map((program, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <program.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <CardDescription className="text-sm">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      {program.modules.map((module, idx) => (
                        <div key={idx} className="flex items-start text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {module}
                        </div>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Duration: {program.duration}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Expert Mentors</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Learn from experienced professionals who have excelled in their respective fields.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {mentors.map((mentor, index) => (
                <Card key={index} className="border-0 shadow-xl text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{mentor.name}</h3>
                    <p className="text-primary font-medium mb-2">{mentor.designation}</p>
                    <p className="text-sm text-muted-foreground mb-3">{mentor.experience}</p>
                    <Badge variant="secondary" className="text-xs mb-4">
                      {mentor.specialization}
                    </Badge>
                    <div className="space-y-1">
                      {mentor.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center justify-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
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

      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Inspiring journeys of our students who achieved their career goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                        <div className="flex items-center justify-center h-full">
                          <Award className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{story.name}</h3>
                      <p className="text-sm text-primary font-medium">{story.achievement}</p>
                      <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{story.rank}</span>
                        <span>•</span>
                        <span>{story.year}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4 text-center">"{story.story}"</p>
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        Currently: {story.currentRole}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Assessment */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Assess Your Career Readiness
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Take our comprehensive assessment to understand your strengths, identify areas for improvement, 
                  and get personalized career guidance from our experts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-white">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Take Free Assessment
                  </Button>
                  <Button size="lg" variant="outline">
                    <Video className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join our career development programs and take the next step towards your dream career in public service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" variant="secondary" className="text-primary">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Explore Programs
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Talk to Career Counselor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
