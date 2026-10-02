import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Users, 
  BookOpen, 
  Clock,
  Award,
  Shield,
  Zap,
  TrendingUp,
  Video,
  FileText,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Foundation",
      description: "Perfect for beginners starting their technology journey",
      price: "₹9,999",
      originalPrice: "₹15,999",
      duration: "6 months",
      badge: "Most Popular",
      badgeColor: "bg-green-500",
      features: [
        "Access to 50+ foundation courses",
        "Live doubt clearing sessions",
        "Weekly mock tests",
        "Study materials (PDF)",
        "Basic performance analytics",
        "Community forum access",
        "Email support"
      ],
      highlights: ["Great for beginners", "Comprehensive foundation"],
      cta: "Start Foundation Course"
    },
    {
      name: "Advanced",
      description: "Comprehensive preparation for serious aspirants",
      price: "₹24,999",
      originalPrice: "₹39,999",
      duration: "12 months",
      badge: "Best Value",
      badgeColor: "bg-primary",
      features: [
        "Access to 150+ advanced courses",
        "Daily live classes with experts",
        "Unlimited mock tests & sectionals",
        "Complete study materials & notes",
        "Detailed performance analytics",
        "Personal mentor assignment",
        "Priority doubt clearing",
        "Interview guidance sessions",
        "Current affairs daily updates"
      ],
      highlights: ["Most comprehensive", "Personal mentorship"],
      cta: "Choose Advanced Plan"
    },
    {
      name: "Premium",
      description: "Complete technology training with premium features",
      price: "₹49,999",
      originalPrice: "₹79,999",
      duration: "18 months",
      badge: "Premium",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      features: [
        "Access to ALL courses & materials",
        "One-on-one mentoring sessions",
        "Unlimited practice tests",
        "Complete printed study materials",
        "Advanced analytics & insights",
        "Exclusive masterclasses",
        "24/7 expert support",
        "Interview preparation program",
        "Personality development sessions",
        "Success guarantee program"
      ],
      highlights: ["Everything included", "Success guarantee"],
      cta: "Go Premium"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "Live Interactive Classes",
      description: "Attend live classes with renowned faculty and interact in real-time"
    },
    {
      icon: FileText,
      title: "Comprehensive Study Material",
      description: "Access detailed notes, practice questions, and reference materials"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and insights"
    },
    {
      icon: MessageCircle,
      title: "Expert Doubt Support",
      description: "Get your doubts cleared by subject matter experts"
    },
    {
      icon: Shield,
      title: "Success Guarantee",
      description: "We're confident in our methods - success guaranteed or money back"
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "95% success rate with thousands of successful candidates"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rank: "Tech Pro Graduate, 2023",
      text: "YuvaBot Lab provided me with the perfect blend of comprehensive content and personalized guidance.",
      plan: "Premium Plan"
    },
    {
      name: "Rajesh Kumar",
      rank: "Tech Pro Graduate, 2023",
      text: "The mock tests and performance analytics helped me identify my weak areas and improve consistently.",
      plan: "Advanced Plan"
    },
    {
      name: "Anjali Singh",
      rank: "Tech Pro Graduate, 2023",
      text: "Starting with the Foundation plan helped me build a strong base. The progression was smooth and effective.",
      plan: "Foundation Plan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              Special Launch Offer - 50% Off
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your Success Plan
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Flexible pricing plans designed to match your preparation needs and budget. 
              Start your technology journey with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Star className="h-5 w-5 mr-2" />
                View All Plans
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Clock className="h-5 w-5 mr-2" />
                Free Trial Available
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pricing Plans</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that best fits your preparation timeline and requirements.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative border-0 shadow-xl hover:shadow-2xl transition-all ${
                  plan.name === 'Advanced' ? 'lg:scale-105 lg:-mt-4' : ''
                }`}>
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">{plan.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        <div className="text-left">
                          <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
                          <div className="text-sm text-muted-foreground">/{plan.duration}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {plan.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full" size="lg">
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What's Included</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Every plan comes with these essential features to ensure your success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Hear from our successful students who achieved their dreams.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-primary font-medium">{testimonial.rank}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.plan}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Get answers to common questions about our pricing and plans.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Can I upgrade my plan later?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade your plan at any time. The price difference will be adjusted based on your remaining subscription period.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Is there a money-back guarantee?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee if you're not satisfied with our courses. Premium plan includes our success guarantee program.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Are there any hidden charges?</h3>
                  <p className="text-muted-foreground">
                    No, there are no hidden charges. The price you see is exactly what you pay. All features mentioned in your plan are included.
                  </p>
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
              Ready to Start Your Technology Training?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of successful aspirants. Choose your plan and begin your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Star className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Talk to Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
