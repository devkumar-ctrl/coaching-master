import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Lock,
  MessageCircle,
  UserCheck,
  FileText,
  Globe,
  Heart,
  Lightbulb,
  Phone,
  Mail,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function SafetyGuidelines() {
  const safetyPrinciples = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your personal information is encrypted and securely stored with industry-standard protocols.",
      details: [
        "256-bit SSL encryption for all data transmission",
        "Regular security audits and updates",
        "Compliance with data protection regulations",
        "Secure payment processing through trusted gateways"
      ]
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "We maintain a respectful and inclusive learning environment for all students.",
      details: [
        "Zero tolerance for harassment or discrimination",
        "Respectful communication in all interactions",
        "Professional conduct in live classes and forums",
        "Constructive feedback and support among peers"
      ]
    },
    {
      icon: Eye,
      title: "Content Monitoring",
      description: "All content is regularly reviewed to ensure quality and appropriateness.",
      details: [
        "Expert review of all course materials",
        "Regular updates to maintain accuracy",
        "Moderation of community discussions",
        "Quick response to inappropriate content reports"
      ]
    },
    {
      icon: Lock,
      title: "Account Security",
      description: "Robust security measures to protect your account and learning progress.",
      details: [
        "Strong password requirements",
        "Two-factor authentication available",
        "Session timeout for inactive accounts",
        "Regular security notifications and alerts"
      ]
    }
  ];

  const guidelines = [
    {
      category: "Online Learning Safety",
      icon: Globe,
      rules: [
        "Use a secure internet connection when accessing the platform",
        "Keep your login credentials confidential and don't share them",
        "Log out from shared or public computers after use",
        "Report any suspicious activity or unauthorized access immediately",
        "Update your browser regularly for optimal security",
        "Be cautious of phishing emails claiming to be from YuvaBot Lab"
      ]
    },
    {
      category: "Communication Ethics",
      icon: MessageCircle,
      rules: [
        "Treat all students, faculty, and staff with respect and courtesy",
        "Use appropriate language in all communications",
        "Avoid sharing personal contact information in public forums",
        "Report harassment, bullying, or inappropriate behavior",
        "Respect intellectual property and don't share copyrighted materials",
        "Maintain confidentiality of other students' personal information"
      ]
    },
    {
      category: "Academic Integrity",
      icon: FileText,
      rules: [
        "Complete all assignments and tests honestly and independently",
        "Don't share test questions or answers with other students",
        "Cite sources properly when using external materials",
        "Report any suspected cheating or academic dishonesty",
        "Use course materials only for personal learning purposes",
        "Respect exam guidelines and time limits"
      ]
    },
    {
      category: "Mental Health & Wellbeing",
      icon: Heart,
      rules: [
        "Take regular breaks during study sessions",
        "Seek help if you're feeling overwhelmed or stressed",
        "Maintain a healthy work-life balance",
        "Use our counseling services when needed",
        "Report if you notice concerning behavior in fellow students",
        "Practice self-care and prioritize your mental health"
      ]
    }
  ];

  const reportingProcess = [
    {
      step: "1",
      title: "Identify the Issue",
      description: "Recognize any violation of safety guidelines or inappropriate behavior"
    },
    {
      step: "2", 
      title: "Document Details",
      description: "Note down specific details including time, date, and people involved"
    },
    {
      step: "3",
      title: "Report Immediately",
      description: "Use our reporting system or contact support directly"
    },
    {
      step: "4",
      title: "Follow Up",
      description: "We'll investigate and keep you informed of the resolution"
    }
  ];

  const emergencyContacts = [
    {
      type: "Safety Concerns",
      contact: "safety@yuvabot.com",
      phone: "+91 98765 43214",
      availability: "24/7"
    },
    {
      type: "Technical Security",
      contact: "security@yuvabot.com", 
      phone: "+91 98765 43215",
      availability: "24/7"
    },
    {
      type: "Student Support",
      contact: "info@YuvaBot.com",
      phone: "+91 98765 43216",
      availability: "9 AM - 9 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              Your Safety is Our Priority
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Safety Guidelines
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Learn about our comprehensive safety measures and guidelines to ensure 
              a secure and positive learning environment for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Shield className="h-5 w-5 mr-2" />
                Read Guidelines
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report an Issue
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Safety Principles</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We've built our platform with safety and security at its core. Here are the key principles that guide our approach.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {safetyPrinciples.map((principle, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                          <principle.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{principle.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{principle.description}</p>
                        <ul className="space-y-2">
                          {principle.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Guidelines */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Safety Guidelines</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Please familiarize yourself with these important guidelines to ensure a safe and productive learning experience.
              </p>
            </div>
            
            <div className="space-y-12">
              {guidelines.map((guideline, index) => (
                <div key={index}>
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mr-4">
                      <guideline.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">{guideline.category}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {guideline.rules.map((rule, idx) => (
                      <Card key={idx} className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-xs font-bold text-primary">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{rule}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How to Report Issues</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                If you encounter any safety concerns or inappropriate behavior, follow these steps to report the issue.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {reportingProcess.map((step, index) => (
                <Card key={index} className="border-0 shadow-xl text-center relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <CardContent className="p-6 pt-10">
                    <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" className="mr-4">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report an Issue
              </Button>
              <Button size="lg" variant="outline">
                <Lightbulb className="h-5 w-5 mr-2" />
                Safety Tips
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Emergency Contacts</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                For urgent safety concerns or security issues, contact us immediately through these channels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-0 shadow-xl text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                      <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{contact.type}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm font-medium text-foreground">{contact.contact}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm font-medium text-foreground">{contact.phone}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Available {contact.availability}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-6">
                    <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Remember: Safety First
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Do:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Keep your account information secure
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Report suspicious activity immediately
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Treat others with respect and kindness
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Follow all community guidelines
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Don't:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Share your login credentials with anyone
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Engage in harassment or bullying
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Share copyrighted materials inappropriately
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          Ignore safety warnings or guidelines
                        </li>
                      </ul>
                    </div>
                  </div>
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
              Questions About Safety?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              If you have any questions about our safety guidelines or need to report an issue, don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-primary">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  View Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
