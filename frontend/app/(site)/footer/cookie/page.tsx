import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cookie, 
  Shield, 
  Settings, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  BarChart, 
  Globe, 
  Calendar,
  Clock,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function CookiePage() {
  const cookieTypes = [
    {
      type: "Essential Cookies",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      description: "These cookies are necessary for the website to function and cannot be switched off.",
      examples: ["Session management", "Security features", "User preferences"]
    },
    {
      type: "Analytics Cookies",
      icon: <BarChart className="h-5 w-5 text-blue-600" />,
      description: "Help us understand how visitors interact with our website by collecting information anonymously.",
      examples: ["Page views", "User behavior", "Performance metrics"]
    },
    {
      type: "Functionality Cookies",
      icon: <Settings className="h-5 w-5 text-purple-600" />,
      description: "Enable enhanced functionality and personalization, such as remembering your preferences.",
      examples: ["Language settings", "Theme preferences", "Course progress"]
    },
    {
      type: "Marketing Cookies",
      icon: <Eye className="h-5 w-5 text-orange-600" />,
      description: "Used to track visitors across websites to display relevant and engaging advertisements.",
      examples: ["Ad targeting", "Social media integration", "Campaign tracking"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Cookie className="h-12 w-12" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Cookie Policy
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Understanding how we use cookies to improve your learning experience
            </p>
            <p className="text-sm text-primary-foreground/80 mt-4">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
        {/* Introduction */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Info className="h-6 w-6 text-primary" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
              They help us provide you with a better, faster, and safer experience by remembering your preferences and 
              understanding how you use our technology training platform.
            </p>
            <p>
              At our training institute, we use cookies to enhance your learning experience, track your progress, 
              and provide personalized content that helps you succeed in your civil services preparation.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Types of Cookies We Use</CardTitle>
            <CardDescription>
              We use different types of cookies to serve different purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {cookie.icon}
                    <h3 className="text-lg font-semibold">{cookie.type}</h3>
                  </div>
                  <p className="text-muted-foreground">{cookie.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How We Use Cookies */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How We Use Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Security & Authentication</h3>
                    <p className="text-muted-foreground text-sm">
                      Keep your account secure and remember your login status across sessions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Personalization</h3>
                    <p className="text-muted-foreground text-sm">
                      Remember your course preferences, study progress, and custom settings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Analytics & Improvement</h3>
                    <p className="text-muted-foreground text-sm">
                      Understand how students use our platform to improve our courses and content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Website Functionality</h3>
                    <p className="text-muted-foreground text-sm">
                      Enable features like video playback, progress tracking, and interactive content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Relevant Content</h3>
                    <p className="text-muted-foreground text-sm">
                      Provide personalized course recommendations and relevant study materials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Optimization</h3>
                    <p className="text-muted-foreground text-sm">
                      Load content faster and provide a smoother learning experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-3">Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  View and delete cookies stored on your device
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  Block cookies from specific websites
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  Set preferences for different types of cookies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  Receive notifications when cookies are being set
                </li>
              </ul>
            </div>

            <div className="border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Important Notice</h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    Disabling certain cookies may affect the functionality of our website and limit your access 
                    to some features like course progress tracking, personalized recommendations, and saved preferences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We may use third-party services that place cookies on your device. These include:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Google Analytics:</strong> To understand website usage and improve our content
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>YouTube:</strong> For embedded educational videos and lectures
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Payment Processors:</strong> For secure course enrollment and transactions
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Social Media Platforms:</strong> For content sharing and social login features
                </div>
              </li>
            </ul>
            <p>
              These third parties have their own privacy policies and cookie policies, which we encourage you to review.
            </p>
          </CardContent>
        </Card>

        {/* Contact and Updates */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Questions & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Policy Updates</p>
                    <p className="text-muted-foreground text-sm">
                      We may update this policy periodically. Check back regularly for changes.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground text-sm">January 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-4">
                <Link href="/contact">
                  <Button className="w-full" size="lg">
                    Contact Us About Cookies
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline" className="w-full" size="lg">
                    Read Our Privacy Policy
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