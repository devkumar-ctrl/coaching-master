import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Share2, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const dataTypes = [
    {
      type: "Personal Information",
      icon: UserCheck,
      description: "Information you provide when creating an account",
      examples: ["Name", "Email address", "Phone number", "Profile picture"],
      purpose: "Account management and communication",
      retention: "Until account deletion",
      color: "bg-blue-500"
    },
    {
      type: "Academic Data",
      icon: FileText,
      description: "Information related to your learning progress",
      examples: ["Course progress", "Test scores", "Study materials", "Notes"],
      purpose: "Track progress and personalize learning",
      retention: "3 years after course completion",
      color: "bg-green-500"
    },
    {
      type: "Usage Information",
      icon: Eye,
      description: "Data about how you interact with our platform",
      examples: ["Login times", "Page views", "Feature usage", "Device info"],
      purpose: "Improve user experience and platform performance",
      retention: "2 years",
      color: "bg-purple-500"
    },
    {
      type: "Communication Data", 
      icon: Mail,
      description: "Records of your communications with us",
      examples: ["Support tickets", "Email correspondence", "Chat logs"],
      purpose: "Provide customer support and resolve issues",
      retention: "5 years for support records",
      color: "bg-orange-500"
    }
  ];

  const rights = [
    {
      right: "Access Your Data",
      description: "Request a copy of all personal data we hold about you",
      action: "Download your data"
    },
    {
      right: "Correct Information",
      description: "Update or correct any inaccurate personal information",
      action: "Edit your profile"
    },
    {
      right: "Delete Your Data",
      description: "Request deletion of your personal data (right to be forgotten)",
      action: "Request deletion"
    },
    {
      right: "Data Portability",
      description: "Export your data in a machine-readable format",
      action: "Export data"
    },
    {
      right: "Restrict Processing",
      description: "Limit how we use your personal information",
      action: "Manage preferences"
    },
    {
      right: "Object to Processing",
      description: "Object to processing based on legitimate interests",
      action: "File objection"
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
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Your privacy is our priority. Learn how we collect, use, and protect 
              your personal information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Shield className="h-5 w-5 mr-2" />
                Your Rights
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Mail className="h-5 w-5 mr-2" />
                Contact Privacy Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Commitment</h2>
              <p className="text-lg text-muted-foreground">
                We are committed to protecting your privacy and handling your data responsibly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Data Protection</h3>
                  <p className="text-muted-foreground">
                    We use industry-standard security measures to protect your personal information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Transparency</h3>
                  <p className="text-muted-foreground">
                    We're clear about what data we collect and how we use it for your benefit.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Your Control</h3>
                  <p className="text-muted-foreground">
                    You have full control over your data with options to access, modify, or delete it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Data We Collect</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We collect different types of information to provide you with the best learning experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {dataTypes.map((data, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${data.color} rounded-full flex items-center justify-center`}>
                        <data.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{data.type}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{data.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Examples:</h4>
                            <div className="flex flex-wrap gap-1">
                              {data.examples.map((example, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Purpose:</h4>
                            <p className="text-xs text-muted-foreground">{data.purpose}</p>
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Retention: {data.retention}
                          </div>
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

      {/* Your Rights */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Privacy Rights</h2>
              <p className="text-lg text-muted-foreground">
                You have comprehensive rights regarding your personal data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{right.right}</h3>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        {right.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="text-lg text-muted-foreground">
                We implement robust security measures to protect your information.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Encryption</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. 
                        Your sensitive information is never stored in plain text.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Secure Storage</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Our databases are hosted on secure servers with regular backups, 
                        access controls, and monitoring to prevent unauthorized access.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Contact Our Privacy Team</h2>
              <p className="text-lg text-muted-foreground">
                Have questions about your privacy? We're here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-4">privacy@yuvabot.com</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground mb-4">+91 98765 43210</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground mb-4">123 Education Street, New Delhi</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Get Directions
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
              Questions About Your Privacy?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Our privacy team is ready to help you understand and exercise your rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-primary">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <FileText className="h-5 w-5 mr-2" />
                Download Policy
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}