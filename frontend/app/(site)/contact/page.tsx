import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  Users,
  Award,
  Building,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      details: ["+91 83403 07574"],
      description: "Mon-Fri, 9 AM - 6 PM · Sat 9 AM - 2 PM"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["hr@YuvaBot.com", "info@YuvaBot.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["9/A3 KrishnaPuri Road", "Morabadi, Ranchi, Jharkhand 834008"],
      description: "Visit our campus"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 2:00 PM"],
      description: "We're here to help"
    }
  ];

  const offices = [
    {
      city: "Ranchi",
      address: "9/A3 KrishnaPuri Road, Morabadi, Ranchi - 834008",
      phone: "+91 83403 07574",
      email: "hr@YuvaBot.com",
      type: "Head Office"
    }
  ];

  const departments = [
    {
      name: "Training & Education",
      email: "hr@YuvaBot.com",
      description: "LazySkool skill programs, enrollment and training queries"
    },
    {
      name: "Industrial Solutions",
      email: "hr@YuvaBot.com",
      description: "IoT, automation, hardware and software solution requests"
    },
    {
      name: "Career Services",
      email: "hr@YuvaBot.com",
      description: "Placement assistance and campus drives"
    },
    {
      name: "Cyber Security",
      email: "hr@YuvaBot.com",
      description: "Security audits, VAPT and network security services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              We're Here to Help
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Have questions about our courses or need assistance? 
              Our friendly team is ready to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Phone className="h-5 w-5 mr-2" />
                Call Us Now
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Choose the best way to reach us. We're available through multiple channels to assist you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-foreground font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Send us a Message</h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input placeholder="Enter your full name" className="h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input type="email" placeholder="Enter your email address" className="h-12" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input placeholder="Enter your phone number" className="h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <Input placeholder="Brief subject of your inquiry" className="h-12" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      How can we help you? *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {["Course Inquiry", "Technical Support", "Billing", "Other"].map((option) => (
                        <Button key={option} variant="outline" size="sm" type="button" className="justify-start">
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry or question..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button size="lg" className="px-12">
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Offices</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Visit us at any of our locations across India for in-person assistance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {offices.map((office, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-foreground">{office.city}</h3>
                      <Badge variant={office.type === "Head Office" ? "default" : "secondary"} className="text-xs">
                        {office.type}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{office.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <p className="text-sm text-foreground font-medium">{office.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <p className="text-sm text-foreground font-medium">{office.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Department Contacts</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Reach out to the right department for faster and more accurate assistance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{dept.email}</span>
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Social Media */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Follow Us</h2>
                <p className="text-muted-foreground mb-8">
                  Stay connected with us on social media for the latest updates, study tips, and success stories.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Facebook, name: "Facebook", followers: "50K+" },
                    { icon: Youtube, name: "YouTube", followers: "100K+" },
                    { icon: Instagram, name: "Instagram", followers: "25K+" },
                    { icon: Twitter, name: "Twitter", followers: "15K+" },
                    { icon: Linkedin, name: "LinkedIn", followers: "10K+" },
                    { icon: Globe, name: "Website", followers: "Visit" }
                  ].map((social, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <social.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="text-sm font-semibold text-foreground">{social.name}</h4>
                        <p className="text-xs text-muted-foreground">{social.followers}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Quick Answers</h2>
                <div className="space-y-4">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-2">What are your response times?</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: Within 24 hours | Live Chat: Immediate | Phone: Mon-Sat, 9 AM - 9 PM
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-2">Can I visit your offices?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! We welcome visits to all our offices. Please call ahead to schedule an appointment.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-2">Do you offer phone consultations?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, we offer free phone consultations for course selection and career guidance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Don't wait! Contact us today and take the first step towards your career in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
