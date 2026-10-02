"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Settings, 
  Star,
  IndianRupee,
  Clock,
  Target,
  Award,
  ChevronRight,
  BarChart3,
  Video,
  Mail,
  User,
  GraduationCap,
  Eye,
  Edit,
  MessageSquare,
  DollarSign,
  UserCheck,
  Bell,
  AlertCircle,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  enrollmentCount: number;
  status: 'draft' | 'published';
  createdAt: string;
  totalRevenue: number;
  reviewsCount: number;
  averageRating: number;
  meetingsCount: number;
  image?: string;
}

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalMeetings: number;
  averageRating: number;
  monthlyRevenue: number;
  recentEnrollments: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'review' | 'meeting' | 'payment';
  message: string;
  timestamp: string;
  courseTitle?: string;
  studentName?: string;
  amount?: number;
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const params = useParams();
  const teacherId = params.id as string;

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalMeetings: 0,
    averageRating: 0,
    monthlyRevenue: 0,
    recentEnrollments: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "COACH" || session.user?.id !== teacherId) {
      redirect("/signin");
    }
  }, [session, status, teacherId]);

  useEffect(() => {
    if (session?.user?.id === teacherId) {
      fetchDashboardData();
    }
  }, [session, teacherId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses with real data
      const coursesResponse = await fetch(`/api/teachers/${teacherId}/courses`);
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        
        // Calculate real stats from courses data
        const totalCourses = coursesData.length;
        const totalStudents = coursesData.reduce((sum: number, course: Course) => sum + course.enrollmentCount, 0);
        const totalRevenue = coursesData.reduce((sum: number, course: Course) => sum + course.totalRevenue, 0);
        const totalMeetings = coursesData.reduce((sum: number, course: Course) => sum + course.meetingsCount, 0);
        const averageRating = coursesData.length > 0 
          ? coursesData.reduce((sum: number, course: Course) => sum + course.averageRating, 0) / coursesData.length 
          : 0;

        setStats({
          totalCourses,
          totalStudents,
          totalRevenue,
          totalMeetings,
          averageRating: Math.round(averageRating * 10) / 10,
          monthlyRevenue: totalRevenue, // Use actual revenue
          recentEnrollments: totalStudents, // Use actual enrollments
          completionRate: totalMeetings // Use actual meeting count for completion rate metric
        });

        // Fetch real recent enrollments and activities
        await fetchRecentActivity(coursesData);
      }

      // Fetch additional meeting analytics if available
      try {
        const analyticsResponse = await fetch(`/api/meetings/analytics?teacherId=${teacherId}&timeRange=7`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setStats(prev => ({
            ...prev,
            recentEnrollments: analyticsData.summary?.totalAttendees || prev.recentEnrollments,
            completionRate: Math.round(analyticsData.summary?.averageAttendancePerMeeting * 10) || prev.completionRate
          }));
        }
      } catch (analyticsError) {
        console.log('Analytics data not available:', analyticsError);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async (coursesData: Course[]) => {
    try {
      const activity: RecentActivity[] = [];

      // Fetch recent enrollments from actual API
      for (const course of coursesData.slice(0, 3)) {
        try {
          const enrollmentsResponse = await fetch(`/api/enrollments?courseId=${course.id}`);
          if (enrollmentsResponse.ok) {
            const enrollments = await enrollmentsResponse.json();
            
            // Add recent enrollments to activity
            enrollments.slice(0, 2).forEach((enrollment: any) => {
              activity.push({
                id: `enroll-${enrollment._id}`,
                type: 'enrollment',
                message: `${enrollment.studentName} enrolled in ${course.title}`,
                timestamp: enrollment.enrolledAt,
                courseTitle: course.title,
                studentName: enrollment.studentName
              });
            });
          }
        } catch (error) {
          console.log(`Could not fetch enrollments for course ${course.id}`);
        }
      }

      // Sort by timestamp and take most recent
      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 8));
      
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to course-based activity if enrollment API fails
      const fallbackActivity: RecentActivity[] = [];
      coursesData.slice(0, 5).forEach((course: Course) => {
        if (course.enrollmentCount > 0) {
          fallbackActivity.push({
            id: `course-${course.id}`,
            type: 'enrollment',
            message: `${course.enrollmentCount} students enrolled in ${course.title}`,
            timestamp: course.createdAt,
            courseTitle: course.title
          });
        }
      });
      setRecentActivity(fallbackActivity);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'meeting': return <Video className="h-4 w-4 text-blue-600" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-2 border-primary/20">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {session?.user?.name?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Teacher'}! 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your courses, track student progress, and grow your teaching impact
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <Link href={`/dashboard/teacher/create-course`}>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
         
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Courses</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
                  <AnimatedCounter end={stats.totalCourses} />
                </p>
              </div>
              <BookOpen className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Students</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-900 dark:text-green-100">
                  <AnimatedCounter end={stats.totalStudents} />
                </p>
              </div>
              <Users className="h-8 w-8 lg:h-10 lg:w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

       

       
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-accent/20 dark:bg-accent/10">
          
          <TabsTrigger value="courses" className="text-xs sm:text-sm">📚 Courses</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">🚀 Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/teacher/create-course`} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all">
                    <Plus className="h-4 w-4 mr-3" />
                    Create New Course
                  </Button>
                </Link>
              </CardContent>
               <CardContent className="space-y-3">
                <Link href={`/dashboard/teacher/${teacherId}/meetings`} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all">
                    <Plus className="h-4 w-4 mr-3" />
                    Publish Class Link 
                  </Button>
                </Link>                              
              </CardContent>
               <CardContent className="space-y-3">
                <Link href={`/dashboard/teacher/${teacherId}/marketing`} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all">
                    <Plus className="h-4 w-4 mr-3" />
                    Premium Email Marketing
                  </Button>
                </Link>                              
              </CardContent>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/teacher/courses`} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-accent transition-all">
                    <Plus className="h-4 w-4 mr-3" />
                    Manage courses 
                  </Button>
                </Link>                              
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">📊 Performance Metrics</CardTitle>
                <CardDescription>Your teaching impact this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
               
                
                <div className="flex items-center justify-between p-3 bg-accent/30 dark:bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Total Enrollments</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent/30 dark:bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Published Courses</span>
                  </div>
                  <span className="font-bold text-purple-600">{courses.filter(c => c.status === 'published').length}</span>
                </div>
                
                
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">🔔 Recent Activity</CardTitle>
                <CardDescription>Latest updates from your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-accent/20 dark:bg-accent/10 rounded-lg hover:bg-accent/30 dark:hover:bg-accent/20 transition-colors">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Your Courses</h2>
              <p className="text-sm text-muted-foreground">Manage and track your course performance</p>
            </div>
            <Link href={`/dashboard/teacher/create-course`}>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 rounded-t-xl flex items-center justify-center">
                      {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-t-xl" />
                      ) : (
                        <GraduationCap className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                          {course.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{course.enrollmentCount} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span>₹{course.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{course.averageRating || 0} ({course.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>{course.meetingsCount} meetings</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Link href={`/courses/${course.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/teacher/courses/${course.id}/edit`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to get started</p>
                <Link href={`/dashboard/teacher/create-course`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link href={`${teacherId}/courses`}>
              <Button variant="outline" className="hover:bg-accent transition-all">
                View All Courses
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">👥 Student Management</CardTitle>
              <CardDescription>View and manage your student community</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Student management coming soon</h3>
              <p className="text-muted-foreground mb-6">
                You'll be able to view student progress, send messages, and track performance here.
              </p>
              <Link href={`${teacherId}/students`}>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  View Students
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">📈 Analytics & Insights</CardTitle>
              <CardDescription>Track your teaching performance and growth</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced analytics coming soon</h3>
              <p className="text-muted-foreground mb-6">
                Get detailed insights into your course performance, student engagement, and revenue trends.
              </p>
              <Link href={`${teacherId}/analytics`}>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50">
        <div className="flex flex-col gap-2">
          <Link href={`${teacherId}/meetings`}>
            <Button size="lg" className="rounded-full shadow-lg hover:scale-110 transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Video className="h-5 w-5 mr-2" />
              Publish class link
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}