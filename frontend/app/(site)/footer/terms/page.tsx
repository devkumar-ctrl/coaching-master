import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  Shield, 
  CreditCard, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  Gavel,
  Book,
  UserX,
  RefreshCw,
  Ban
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "Account Registration",
      icon: Users,
      description: "Requirements and responsibilities for creating an account",
      items: [
        "You must be at least 16 years old to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the security of your account credentials",
        "Notify us immediately of any unauthorized account access",
        "One account per person - duplicate accounts are prohibited"
      ],
      color: "bg-blue-500"
    },
    {
      title: "Course Access & Usage",
      icon: Book,
      description: "Terms governing course enrollment and content access",
      items: [
        "Course access is granted upon successful payment and enrollment",
        "Content is for personal use only - sharing is prohibited",
        "Course materials remain our intellectual property",
        "Access duration varies by course type and package",
        "No downloads or offline storage of copyrighted materials"
      ],
      color: "bg-green-500"
    },
    {
      title: "Payment Terms",
      icon: CreditCard,
      description: "Billing, refunds, and payment processing policies",
      items: [
        "All payments are processed securely through our payment partners",
        "Refunds are available within 7 days of purchase for eligible courses",
        "No refunds for courses accessed beyond 25% completion",
        "Prices may change with 30 days notice to existing users",
        "Failed payments may result in immediate access suspension"
      ],
      color: "bg-purple-500"
    },
    {
      title: "User Conduct",
      icon: Shield,
      description: "Expected behavior and prohibited activities",
      items: [
        "Treat all users, instructors, and staff with respect",
        "No harassment, hate speech, or discriminatory behavior",
        "Prohibition on sharing, selling, or distributing course content",
        "No spamming, solicitation, or commercial activities",
        "Report any violations or suspicious activities to our team"
      ],
      color: "bg-red-500"
    }
  ];

  const violations = [
    {
      violation: "Content Piracy",
      description: "Sharing or distributing course materials without permission",
      consequence: "Immediate account termination and legal action",
      severity: "high"
    },
    {
      violation: "Account Sharing", 
      description: "Allowing others to use your account credentials",
      consequence: "Warning followed by account suspension",
      severity: "medium"
    },
    {
      violation: "Harassment",
      description: "Inappropriate behavior towards other users or staff",
      consequence: "Temporary or permanent ban depending on severity",
      severity: "high"
    },
    {
      violation: "Spam/Commercial Activity",
      description: "Unsolicited marketing or promotional activities",
      consequence: "Warning and content removal",
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              Effective Date: January 27, 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              By using YuvaBot Lab, you agree to these terms. Please read them carefully 
              to understand your rights and responsibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Scale className="h-5 w-5 mr-2" />
                Legal Summary
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <FileText className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance Notice */}
      <section className="py-12 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 dark:border-amber-800 bg-white/50 dark:bg-amber-900/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Agreement to Terms</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      By accessing and using YuvaBot Lab platform, you acknowledge that you have read, 
                      understood, and agree to be bound by these Terms of Service. If you do not agree 
                      to these terms, please do not use our services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Key Terms & Conditions</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These are the main areas that govern your use of our platform and services.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${section.color} rounded-full flex items-center justify-center`}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{section.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                        
                        <div className="space-y-2">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Prohibited Activities</h2>
              <p className="text-lg text-muted-foreground">
                Activities that may result in account suspension or termination.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {violations.map((violation, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{violation.violation}</h3>
                      <Badge 
                        variant={violation.severity === "high" ? "destructive" : violation.severity === "medium" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {violation.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{violation.description}</p>
                    
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-red-600">Consequence:</p>
                        <p className="text-xs text-muted-foreground">{violation.consequence}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-lg text-muted-foreground">
                Understanding ownership and usage rights of platform content.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Our Content</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        All course materials, videos, text, graphics, logos, and software are owned by 
                        YuvaBot Lab or our content partners and are protected by copyright laws.
                      </p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Licensed for personal use only</li>
                        <li>• No redistribution or sharing</li>
                        <li>• No reverse engineering</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Your Content</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Content you submit (comments, questions, reviews) remains yours, but you grant 
                        us a license to use it for platform improvement and marketing.
                      </p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• You retain ownership</li>
                        <li>• We can display and moderate</li>
                        <li>• Used for platform improvement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Account Termination</h2>
              <p className="text-lg text-muted-foreground">
                Conditions under which accounts may be suspended or terminated.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 mb-4">
                    <UserX className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">By You</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You may close your account at any time through your profile settings.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Close Account
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                    <Ban className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">By Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We may terminate accounts for violations of these terms or illegal activity.
                  </p>
                  <Button size="sm" variant="destructive" className="w-full" disabled>
                    Terms Violation
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                    <RefreshCw className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Reactivation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Suspended accounts may be reactivated upon resolution of issues.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Appeal Process
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
              <p className="text-lg text-muted-foreground">
                Our legal team is available to clarify any terms or conditions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Email Support</h3>
                      <p className="text-sm text-muted-foreground">legal@yuvabot.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Send Legal Inquiry
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Call Legal Team
                  </Button>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Now that you understand our terms, join thousands of students achieving their technology dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" variant="secondary" className="text-primary">
                  <Book className="h-5 w-5 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Gavel className="h-5 w-5 mr-2" />
                Legal Questions
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
