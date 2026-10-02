import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Users,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function HelpCenter() {
  const faqs = [
    {
      category: "Account & Registration",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' in the top right corner, enter your details, and verify your email address. You'll receive a confirmation email to activate your account."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and you'll receive a password reset link."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, go to Profile Settings > Account Information and update your email address. You'll need to verify the new email."
        }
      ]
    },
    {
      category: "Courses & Content",
      questions: [
        {
          question: "How do I enroll in a course?",
          answer: "Browse our course catalog, select the course you want, click 'Enroll Now', complete the payment process, and you'll have immediate access."
        },
        {
          question: "Can I access courses on mobile devices?",
          answer: "Yes, our platform is fully mobile-optimized. You can access all courses, materials, and live sessions on any device."
        },
        {
          question: "How long do I have access to enrolled courses?",
          answer: "Course access duration depends on your plan. Foundation plans offer 6 months, Advanced 12 months, and Premium plans 18 months access."
        }
      ]
    },
    {
      category: "Payments & Billing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway."
        },
        {
          question: "Is there a refund policy?",
          answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our courses. Premium plans include our success guarantee."
        },
        {
          question: "Can I upgrade my plan later?",
          answer: "Absolutely! You can upgrade your plan anytime. The price difference will be adjusted based on your remaining subscription period."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble accessing live classes",
          answer: "Ensure you have a stable internet connection and updated browser. Clear cache/cookies or try a different browser. Contact support if issues persist."
        },
        {
          question: "Videos are not playing properly",
          answer: "Check your internet speed (minimum 2 Mbps required), disable ad blockers, and ensure JavaScript is enabled in your browser."
        },
        {
          question: "How do I download study materials?",
          answer: "Navigate to your course dashboard, go to 'Materials' section, and click the download icon next to each document."
        }
      ]
    }
  ];

  const helpTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to navigate and make the most of our platform",
      articles: 12,
      color: "bg-blue-500"
    },
    {
      icon: Video,
      title: "Live Classes",
      description: "Everything about attending and participating in live sessions",
      articles: 8,
      color: "bg-green-500"
    },
    {
      icon: FileText,
      title: "Study Materials",
      description: "Access, download, and organize your study resources",
      articles: 15,
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow students and participate in discussions",
      articles: 6,
      color: "bg-orange-500"
    },
    {
      icon: MessageCircle,
      title: "Doubt Clearing",
      description: "How to get your doubts resolved by expert faculty",
      articles: 10,
      color: "bg-red-500"
    },
    {
      icon: Star,
      title: "Performance Tracking",
      description: "Monitor your progress and analyze your performance",
      articles: 7,
      color: "bg-indigo-500"
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Available 24/7",
      action: "Start Chat",
      color: "bg-green-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      availability: "info@YuvaBot.com",
      action: "Send Email",
      color: "bg-blue-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      availability: "Mon-Sat, 9 AM - 9 PM",
      action: "Call Now",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              24/7 Support Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Find answers to your questions and get the support you need. 
              We're here to help you succeed in your technology journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for help articles, FAQs, or topics..."
                  className="pl-12 h-14 text-lg bg-background text-foreground"
                />
                <Button size="lg" className="absolute right-2 top-2">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Help Topics</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Browse our most popular help topics to find quick solutions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpTopics.map((topic, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${topic.color} rounded-full flex items-center justify-center`}>
                        <topic.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {topic.articles} articles
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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

      {/* FAQs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Find quick answers to the most commonly asked questions.
              </p>
            </div>
            
            <div className="space-y-12">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                    <HelpCircle className="h-6 w-6 text-primary mr-3" />
                    {category.category}
                  </h3>
                  <div className="grid gap-6">
                    {category.questions.map((faq, index) => (
                      <Card key={index} className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold text-foreground mb-3 flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            {faq.question}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed pl-8">
                            {faq.answer}
                          </p>
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

      {/* Contact Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Still Need Help?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Can't find what you're looking for? Our support team is ready to assist you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactOptions.map((option, index) => (
                <Card key={index} className="border-0 shadow-xl text-center">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} rounded-full mb-6`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{option.title}</h3>
                    <p className="text-muted-foreground mb-4">{option.description}</p>
                    <p className="text-sm text-muted-foreground mb-6">{option.availability}</p>
                    <Button className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="border-0 shadow-2xl max-w-4xl mx-auto">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input type="email" placeholder="Enter your email address" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input placeholder="Enter your phone number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <Input placeholder="Brief subject of your inquiry" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Describe your issue or question in detail..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button size="lg" className="px-12">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Quick Links</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/courses" className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Course Catalog</h3>
                    <p className="text-sm text-muted-foreground">Browse all available courses</p>
                  </CardContent>
                </Card>
              </Link>
              
             
              
              <Link href="/contact" className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                    <p className="text-sm text-muted-foreground">Get in touch with our team</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/about" className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">About Us</h3>
                    <p className="text-sm text-muted-foreground">Learn more about YuvaBot Lab</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
