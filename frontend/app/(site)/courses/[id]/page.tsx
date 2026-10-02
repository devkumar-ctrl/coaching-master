"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Users, Clock, MapPin, GraduationCap, CheckCircle, Star, ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  duration: string;
  level: string;
  enrolledCount?: number;
  enrollmentCount?: number;
  status: "draft" | "published";
  teacherId: string;
  teacherName?: string;
  teacherEmail?: string;
  deliveryMode: string;
  totalClasses: number;
  syllabus?: string;
  createdAt: string;
  averageRating?: number;
  totalReviews?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    image?: string;
  };
  helpful: number;
  reported: boolean;
}

// Component to display structured syllabus
function SyllabusDisplay({ syllabus }: { syllabus: string }) {
  // Parse the new dynamic column format
  const parseDynamicSyllabus = (syllabusText: string) => {
    const lines = syllabusText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return null;
    
    // First line contains column headers separated by |
    const headerLine = lines[0];
    const separatorLine = lines[1];
    
    // Check if this is the new format (has separator line with ===)
    if (!separatorLine.includes('=')) {
      return null; // Fall back to old parsing
    }
    
    const headers = headerLine.split(' | ').map(h => h.trim());
    const dataLines = lines.slice(2);
    
    const rows = dataLines.map((line, index) => {
      const values = line.split(' | ').map(v => v.trim());
      const row: Record<string, string> = { id: index.toString() };
      
      headers.forEach((header, headerIndex) => {
        row[header.toLowerCase().replace(/\s+/g, '_')] = values[headerIndex] || '';
      });
      
      return row;
    });
    
    return { headers, rows };
  };
  
  // Parse the old format (fallback)
  const parseOldSyllabus = (syllabusText: string) => {
    const modules = [];
    const sections = syllabusText.split('\n\n').filter(section => section.trim());
    
    for (const section of sections) {
      const lines = section.trim().split('\n');
      if (lines.length >= 3) {
        const moduleTopicLine = lines[0];
        const durationLine = lines[1];
        const descriptionLine = lines[2];
        
        // Extract module and topic from "Module X: Topic"
        const moduleMatch = moduleTopicLine.match(/^(.+?):\s*(.+)$/);
        if (moduleMatch) {
          const module = moduleMatch[1];
          const topic = moduleMatch[2];
          
          // Extract duration from "Duration: X"
          const durationMatch = durationLine.match(/Duration:\s*(.+)$/);
          const duration = durationMatch ? durationMatch[1] : 'Not specified';
          
          // Extract description from "Description: X"
          const descriptionMatch = descriptionLine.match(/Description:\s*(.+)$/);
          const description = descriptionMatch ? descriptionMatch[1] : 'No description';
          
          modules.push({
            module,
            topic,
            duration,
            description
          });
        }
      }
    }
    
    return modules;
  };
  
  // Try to parse as dynamic format first
  const dynamicData = parseDynamicSyllabus(syllabus);
  
  if (dynamicData) {
    // Render dynamic column format
    return (
      <div className="space-y-4">
        <div className="bg-primary/5 dark:bg-primary/10 p-3 sm:p-4 rounded-lg border border-primary/20">
          <p className="text-xs sm:text-sm text-primary">
            📚 <strong>{dynamicData.rows.length} modules</strong> with <strong>{dynamicData.headers.length} custom fields</strong> designed for comprehensive learning
          </p>
        </div>
        
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50 dark:bg-accent/20">
                {dynamicData.headers.map((header, index) => (
                  <TableHead key={index} className="font-semibold text-xs sm:text-sm">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynamicData.rows.map((row, index) => (
                <TableRow key={index} className="hover:bg-accent/30 dark:hover:bg-accent/10 transition-colors">
                  {dynamicData.headers.map((header, headerIndex) => {
                    const fieldKey = header.toLowerCase().replace(/\s+/g, '_');
                    const value = row[fieldKey] || '';
                    const isFirstColumn = headerIndex === 0;
                    
                    return (
                      <TableCell 
                        key={headerIndex} 
                        className={isFirstColumn ? "font-medium text-primary text-xs sm:text-sm" : "text-xs sm:text-sm"}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-xs sm:text-sm text-muted-foreground bg-accent/30 dark:bg-accent/10 p-3 rounded-lg border border-accent">
          <p>✅ <strong>Customized Curriculum:</strong> This syllabus has been tailored with specific fields to provide you with detailed course information.</p>
        </div>
      </div>
    );
  }
  
  // Fall back to old format parsing
  const syllabusData = parseOldSyllabus(syllabus);
  
  // If parsing fails or no structured data, show as plain text
  if (syllabusData.length === 0) {
    return (
      <div className="bg-accent/30 dark:bg-accent/10 rounded-lg p-4 sm:p-6 border border-accent">
        <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
          {syllabus}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-primary/5 dark:bg-primary/10 p-3 sm:p-4 rounded-lg border border-primary/20">
        <p className="text-xs sm:text-sm text-primary">
          📚 <strong>{syllabusData.length} modules</strong> carefully designed to take you from basics to advanced level
        </p>
      </div>
      
      <div className="border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50 dark:bg-accent/20">
              <TableHead className="font-semibold text-xs sm:text-sm">Module</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Topic</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm w-20 sm:w-24">Duration</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syllabusData.map((item, index) => (
              <TableRow key={index} className="hover:bg-accent/30 dark:hover:bg-accent/10 transition-colors">
                <TableCell className="font-medium text-primary text-xs sm:text-sm">
                  {item.module}
                </TableCell>
                <TableCell className="font-medium text-xs sm:text-sm">
                  {item.topic}
                </TableCell>
                <TableCell className="text-xs sm:text-sm text-muted-foreground">
                  {item.duration}
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {item.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs sm:text-sm text-muted-foreground bg-accent/30 dark:bg-accent/10 p-3 rounded-lg border border-accent">
        <p>✅ <strong>Professional Curriculum:</strong> Each module builds upon the previous one, ensuring comprehensive understanding and retention.</p>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      checkEnrollmentStatus();
      fetchReviews();
    }
  }, [courseId, session]);

  const fetchReviews = async (page = 1) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews?courseId=${courseId}&page=${page}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMoreReviews(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadMoreReviews = () => {
    const nextPage = reviewPage + 1;
    setReviewPage(nextPage);
    fetchReviews(nextPage);
  };

  const checkEnrollmentStatus = async () => {
    if (!session?.user?.id || session.user.role !== 'STUDENT') return;
    
    try {
      const response = await fetch(`/api/enrollments?studentId=${session.user.id}`);
      if (response.ok) {
        const enrollments = await response.json();
        const enrolled = enrollments.some((e: any) => e.courseId === courseId);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnrollment = async () => {
    if (!session?.user?.id) {
      alert('Please sign in to enroll in courses');
      return;
    }

    if (session.user.role !== 'STUDENT') {
      alert('Only students can enroll in courses');
      return;
    }

    if (!course) return;

    setEnrolling(true);
    try {
      // Create Razorpay order
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: course.price,
          courseId: courseId,
          courseName: course.title
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      const orderData = await response.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'YuvaBot Lab',
          description: `Enrollment for ${course.title}`,
          image: '/logo.jpg',
          order_id: orderData.orderId,
          prefill: {
            name: session.user.name || '',
            email: session.user.email || '',
          },
          theme: {
            color: '#2563eb'
          },
          handler: async function (response: any) {
            try {
              // Verify payment on server
              const verifyResponse = await fetch('/api/payments', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: courseId
                }),
              });

              if (verifyResponse.ok) {
                const result = await verifyResponse.json();
                setIsEnrolled(true);
                alert('🎉 Payment successful! You are now enrolled in the course.');
                // Refresh course data to update enrollment count
                fetchCourse();
              } else {
                const error = await verifyResponse.json();
                alert(`Payment verification failed: ${error.error}`);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            } finally {
              setEnrolling(false);
            }
          },
          modal: {
            ondismiss: function() {
              setEnrolling(false);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
      
      script.onerror = () => {
        alert('Failed to load payment gateway. Please try again.');
        setEnrolling(false);
      };
      
      document.body.appendChild(script);

    } catch (error) {
      console.error("Error creating payment order:", error);
      alert(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
      setEnrolling(false);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const fetchedCourse = await response.json();
      setCourse({
        ...fetchedCourse,
        id: fetchedCourse.id || fetchedCourse._id
      });
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "cyber-security": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "ethical-hacking": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "ai-ml": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "data-science": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "iot-embedded": return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400";
      case "robotics": return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
      case "web-development": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "ev-technology": return "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400";
      case "cloud-devops": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "python": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <Card className="p-8 sm:p-12 text-center border-0 shadow-lg">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Course not found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/courses">
            <Button className="transition-all hover:scale-[1.02]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/courses">
          <Button variant="outline" size="sm" className="hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">{/* Main Content */}
        <div className="xl:col-span-2 space-y-6">{/* Course Header */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="aspect-video relative bg-gradient-to-br from-primary/80 via-primary to-primary/60 dark:from-primary/60 dark:via-primary/80 dark:to-primary/40">{course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-white/90" />
                </div>
              )}
              
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-2">
                <Badge className={`${getCategoryBadgeColor(course.category)} font-medium text-xs`}>
                  {course.category.replace('-', ' ')}
                </Badge>
                <Badge className={`${getLevelBadgeColor(course.level)} font-medium text-xs`}>
                  {course.level.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">{course.title}</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">{course.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {course.teacherName?.charAt(0) || "T"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm sm:text-base">Instructor: {course.teacherName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Expert Faculty</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-accent/50 dark:bg-accent/20 rounded-lg transition-colors">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs sm:text-sm font-medium">{course.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-accent/50 dark:bg-accent/20 rounded-lg transition-colors">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs sm:text-sm font-medium">{course.totalClasses}</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-accent/50 dark:bg-accent/20 rounded-lg transition-colors">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs sm:text-sm font-medium capitalize">
                    {course.deliveryMode.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">Mode</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-accent/50 dark:bg-accent/20 rounded-lg transition-colors">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs sm:text-sm font-medium">{course.enrolledCount ?? course.enrollmentCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <div className="space-y-6">
            {/* Course Description */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                  {course.description}
                </p>
                
                {/* Course Syllabus */}
                {course.syllabus && (
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Course Syllabus
                    </h3>
                    <SyllabusDisplay syllabus={course.syllabus} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Course Features */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start group">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">Live Interactive Classes</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Engage with expert faculty in real-time
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">Comprehensive Study Material</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        NCERT-based content with standard references
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">Regular Assessments</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Track your progress with periodic tests
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">Doubt Clearing Sessions</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Get your queries resolved by experts
                      </p>
                    </div>
                  </div>
                  
                 
                  
                  <div className="flex items-start group">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base mb-1">Personal Mentorship</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        One-on-one guidance from experienced faculty
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 order-first xl:order-last">
          <div className="sticky top-4 sm:top-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                    ₹{course.price.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Course Fee</p>
                </div>
                
                <Button 
                  className="w-full mb-3 sm:mb-4 transition-all hover:scale-[1.02]" 
                  size="lg"
                  onClick={handleEnrollment}
                  disabled={enrolling || isEnrolled || session?.user?.role !== 'STUDENT'}
                >
                  {enrolling ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : 
                   isEnrolled ? '✅ Enrolled' : 
                   session?.user?.role !== 'STUDENT' ? 'Sign in as Student' :
                   `Pay ₹${course?.price?.toLocaleString()} & Enroll`}
                </Button>
                
                
                
                <Separator className="mb-4 sm:mb-6" />
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">Category:</span>
                    <span className="text-xs sm:text-sm font-medium capitalize">
                      {course.category.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">Target:</span>
                    <span className="text-xs sm:text-sm font-medium">
                      {course.level.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">Duration:</span>
                    <span className="text-xs sm:text-sm font-medium">{course.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">Classes:</span>
                    <span className="text-xs sm:text-sm font-medium">{course.totalClasses}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Mode:</span>
                    <span className="text-xs sm:text-sm font-medium capitalize">
                      {course.deliveryMode.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4 sm:my-6" />
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          star <= Math.floor(course.averageRating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-muted-foreground/30'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-xs sm:text-sm font-medium">
                      {course.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {course.totalReviews || 0} student reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 sm:mt-12">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <MessageSquare className="h-5 w-5" />
                  Student Reviews
                </CardTitle>
                <CardDescription className="text-sm">
                  What our students say about this course
                </CardDescription>
              </div>
              {course?.averageRating && (
                <div className="text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-end gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-sm sm:text-base">{course.averageRating.toFixed(1)}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({course.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {reviews.length === 0 && !reviewsLoading ? (
              <div className="text-center py-8 sm:py-12">
                <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your experience with this course!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border/50 pb-4 sm:pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <AvatarImage src={review.student.image} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                          {review.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base truncate">{review.student.name}</h4>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${
                                    star <= review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-muted-foreground/30'
                                  }`} 
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto hover:bg-accent">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {review.helpful}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {hasMoreReviews && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={loadMoreReviews}
                      disabled={reviewsLoading}
                      className="hover:bg-accent"
                    >
                      {reviewsLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Loading...
                        </div>
                      ) : 'Load More Reviews'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
