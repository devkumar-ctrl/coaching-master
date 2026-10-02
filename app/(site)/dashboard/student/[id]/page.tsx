"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  Video,
  FileText,
  Star,
  Target,
  GraduationCap,
  Trophy,
  Bell,
  Play,
  Copy,
  Check,
  ExternalLink,
  Timer,
  BarChart,
  File,
  Book,
  Bookmark,
  CheckCircle,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Settings,
  KeyRound
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import LiveClassViewer from "@/components/meetings/live-class-viewer";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  progress: number;
  teacherName: string;
  totalClasses: number;
  completedClasses: number;
  nextClass?: {
    date: string;
    time: string;
    topic: string;
  };
}

interface Meeting {
  id: string;
  meetingId: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  topic: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isInstant: boolean;
  // Zoom disabled — these are optional and may be absent. Live classes use Daily.co.
  zoomData?: {
    join_url?: string;
    start_url?: string;
    password?: string;
    meeting_id?: string;
  } | null;
  daily?: {
    roomId?: string;
    roomUrl?: string;
    url?: string;
  };
  status: 'scheduled' | 'live' | 'completed' | 'ended';
  course?: {
    id: string;
    title: string;
    image?: string;
  };
}

// Resolve a join URL for a meeting: prefer Daily.co room, then legacy join_url.
function meetingJoinUrl(m: Meeting): string {
  return m.daily?.roomUrl || m.daily?.url || m.zoomData?.join_url || '';
}

interface Payment {
  id: string;
  paymentId: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: string;
  completedAt: string;
  course?: {
    id: string;
    title: string;
    image?: string;
    category: string;
  };
}

interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  averageProgress: number;
  certificates: number;
  upcomingClasses: number;
}

function getCategoryInfo(category = "") {
  const map: Record<string, { label: string; cls: string }> = {
    "cyber-security": { label: "Cyber Security", cls: "bg-red-500/10 text-red-600 dark:text-red-400" },
    "ethical-hacking": { label: "Ethical Hacking", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    "ai-ml": { label: "AI & ML", cls: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
    "data-science": { label: "Data Science", cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    "iot-embedded": { label: "IoT & Embedded", cls: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
    "robotics": { label: "Robotics", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    "web-development": { label: "Web Development", cls: "bg-green-500/10 text-green-600 dark:text-green-400" },
    "ev-technology": { label: "EV Technology", cls: "bg-lime-500/10 text-lime-600 dark:text-lime-400" },
    "cloud-devops": { label: "Cloud & DevOps", cls: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    "python": { label: "Python", cls: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  };
  return map[category] ?? {
    label: category ? category.replace(/-/g, " ") : "Training Program",
    cls: "bg-muted text-muted-foreground"
  };
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const params = useParams();
  const studentId = params.id as string;
  
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<StudentStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageProgress: 0,
    certificates: 0,
    upcomingClasses: 0
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);

  // Check if user is authorized
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "STUDENT" || session.user?.id !== studentId) {
      redirect("/auth/signin");
    }
  }, [session, status, studentId]);

  // Fetch student's enrolled courses
  useEffect(() => {
    if (session?.user?.role === "STUDENT" && session.user.id === studentId) {
      fetchEnrolledCourses();
      fetchMeetings();
      fetchPayments();
    }
  }, [session, studentId]);

  // Auto-refresh meetings every 30 seconds when on meetings tab
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.role === "STUDENT") {
        fetchMeetings(); // Refresh when tab becomes visible
      }
    };

    if (session?.user?.role === "STUDENT" && session.user.id === studentId) {
      // Set up polling for meetings
      interval = setInterval(() => {
        fetchMeetings();
      }, 30000); // Refresh every 30 seconds

      // Refresh when user comes back to tab
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, studentId]);

  // Helper function to copy URL with visual feedback
  const copyToClipboard = async (text: string, meetingId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrls(prev => new Set([...prev, meetingId]));
      toast.success("Meeting link copied to clipboard!", {
        description: "Share this link with others to let them join."
      });
      // Remove the copied state after 2 seconds
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(meetingId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL to clipboard');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.currentPassword.length === 0) {
      toast.error("Enter your current password");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to change password");
      toast.success("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/payments`);
      if (response.ok) {
        const fetchedPayments = await response.json();
        setPayments(Array.isArray(fetchedPayments) ? fetchedPayments : []);
      } else {
        console.warn("Failed to fetch payments:", response.status);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/meetings?type=upcoming`);
      if (response.ok) {
        const fetchedMeetings = await response.json();
        setMeetings(Array.isArray(fetchedMeetings) ? fetchedMeetings : []);
      } else {
        console.warn("Failed to fetch meetings:", response.status);
        setMeetings([]);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setMeetings([]);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/courses`);
      if (response.ok) {
        const fetchedCourses = await response.json();
        setEnrolledCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
        
        // Calculate stats from real data
        const totalCourses = fetchedCourses.length;
        const completedCourses = fetchedCourses.filter((course: Course) => course.progress >= 90).length;
        const averageProgress = totalCourses > 0 
          ? fetchedCourses.reduce((acc: number, course: Course) => acc + course.progress, 0) / totalCourses 
          : 0;
        const totalHours = fetchedCourses.reduce((acc: number, course: Course) => acc + course.completedClasses * 2, 0);
        
        setStats({
          totalCourses,
          completedCourses,
          totalHours,
          averageProgress: Math.round(averageProgress),
          certificates: completedCourses,
          upcomingClasses: fetchedCourses.filter((course: Course) => course.nextClass).length
        });
      } else {
        console.warn("Failed to fetch enrolled courses:", response.status);
        setEnrolledCourses([]);
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          totalHours: 0,
          averageProgress: 0,
          certificates: 0,
          upcomingClasses: 0
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setEnrolledCourses([]);
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Enrolled Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      strip: "from-blue-500 to-blue-400",
      chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Study Hours",
      value: stats.totalHours,
      icon: Clock,
      strip: "from-emerald-500 to-emerald-400",
      chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Certificates",
      value: stats.certificates,
      icon: Award,
      strip: "from-amber-500 to-amber-400",
      chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Upcoming Classes",
      value: stats.upcomingClasses,
      icon: Calendar,
      strip: "from-violet-500 to-violet-400",
      chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-b from-primary/[0.05] via-transparent to-transparent" />
        <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 left-1/4 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      {/* Student Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground shadow-xl ring-1 ring-ring/10 mb-4 sm:mb-6 lg:mb-8">
        <div className="absolute -top-24 -right-16 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-amber-400/25 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid-black opacity-[0.06]" />
        
        <div className="relative flex flex-col lg:flex-row items-center lg:items-center gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
          <div className="relative">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-primary-foreground/25 shadow-xl">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="text-lg sm:text-xl lg:text-2xl bg-background text-primary">
                {session?.user?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 rounded-full p-1 border-2 border-background">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <p className="flex items-center justify-center lg:justify-start gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              YuvaBot Learning Dashboard
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1.5">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">
                {session?.user?.name?.split(' ')[0] || "Student"}!
              </span>
            </h1>
            <p className="text-primary-foreground/75 mb-2 text-sm sm:text-base">
              Continue your technology training journey with YuvaBot Lab
            </p>
            <p className="text-[11px] sm:text-xs text-primary-foreground/50 mb-3">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 bg-blue-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap ring-1 ring-primary-foreground/10">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {stats.totalCourses} Courses
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap ring-1 ring-primary-foreground/10">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {stats.totalHours} Hours
              </div>
              <div className="flex items-center gap-1.5 bg-amber-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap ring-1 ring-primary-foreground/10">
                <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {stats.certificates} Certificates
              </div>
            </div>
          </div>
          
          <div className="relative bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 text-center shadow-lg ring-1 ring-primary-foreground/15 w-full sm:w-auto max-w-xs">
            <div className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
              Average Progress
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground">{stats.averageProgress}%</div>
            <Progress 
              value={stats.averageProgress} 
              className="h-2 mt-4 bg-primary-foreground/15 [&>div]:bg-amber-400" 
            />
            <p className="text-[11px] text-primary-foreground/60 mt-2">
              across {stats.totalCourses} course{stats.totalCourses !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-6 lg:mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="card-hover relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className={`h-1 w-full bg-gradient-to-r ${stat.strip}`} />
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.chip} p-2.5 sm:p-3 rounded-xl`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="!h-auto !w-full !grid !gap-1.5 !p-1.5 !rounded-2xl !border !border-border/60 !bg-muted/70 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="overview" className="!h-auto !flex-1 !rounded-xl !px-4 !py-2.5 font-medium whitespace-nowrap data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:!shadow-md">
              <BarChart className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="!h-auto !flex-1 !rounded-xl !px-4 !py-2.5 font-medium whitespace-nowrap data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:!shadow-md">
              <Book className="h-4 w-4 mr-2" /> Courses
            </TabsTrigger>
            <TabsTrigger value="meetings" className="!h-auto !flex-1 !rounded-xl !px-4 !py-2.5 font-medium whitespace-nowrap data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:!shadow-md">
              <Video className="h-4 w-4 mr-2" /> Meetings
            </TabsTrigger>
            <TabsTrigger value="payments" className="!h-auto !flex-1 !rounded-xl !px-4 !py-2.5 font-medium whitespace-nowrap data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:!shadow-md">
              <File className="h-4 w-4 mr-2" /> Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="!h-auto !flex-1 !rounded-xl !px-4 !py-2.5 font-medium whitespace-nowrap data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:!shadow-md">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Current Courses */}
            <Card className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      Continue Learning
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-xs sm:text-sm mt-1.5">Pick up where you left off</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {enrolledCourses.length > 0 ? (
                  <>
                    {enrolledCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-muted/50 transition-colors border-b border-border/50">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border shadow-sm flex-shrink-0">
                          {course.image ? (
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
                              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-primary/60" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground">By {course.teacherName}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1 text-muted-foreground">
                              <span>{course.progress}% Complete</span>
                              <span className="text-primary font-medium">{course.completedClasses}/{course.totalClasses} classes</span>
                            </div>
                            <Progress 
                              value={course.progress} 
                              className="h-2.5 bg-muted" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 sm:p-4 text-center">
                      <Link href="/courses" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-1.5">
                        View all courses <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-8 sm:p-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">No courses yet</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">Enroll in a course to start your learning journey.</p>
                    <Link href="/courses">
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-sm">
                        Browse Courses <ExternalLink className="h-3.5 w-3.5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                        <Calendar className="h-4 w-4" />
                      </span>
                      Upcoming Classes
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70 text-xs sm:text-sm mt-1.5">Don't miss your scheduled sessions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {enrolledCourses
                  .filter(course => course.nextClass)
                  .slice(0, 3)
                  .map((course) => (
                    <div key={course.id} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-muted/50 transition-colors border-b border-border/50">
                      <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-xl px-2.5 py-2 text-center border border-primary/10 flex-shrink-0 w-14">
                        <div className="text-lg sm:text-xl font-extrabold text-primary">
                          {new Date(course.nextClass!.date).getDate()}
                        </div>
                        <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {new Date(course.nextClass!.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">{course.nextClass!.topic}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>{course.nextClass!.time}</span>
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" size="sm" className="shrink-0 text-xs sm:text-sm px-2 sm:px-4">
                        <Link href={`/courses/${course.id}`}>
                          <Video className="h-3.5 w-3.5 mr-1.5" />
                          Join
                        </Link>
                      </Button>
                    </div>
                  ))
                }
                {enrolledCourses.filter(course => course.nextClass).length === 0 && (
                  <div className="p-8 sm:p-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground mb-1.5">No upcoming classes scheduled</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Your teachers will schedule sessions for your courses.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Courses</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{stats.totalCourses} enrolled • {stats.completedCourses} completed</p>
            </div>
            <Link href="/courses">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                Browse More Courses <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10">
                  <Book className="h-7 w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5">You haven't enrolled in any courses</h3>
                <p className="text-sm text-muted-foreground mb-5">Explore our training programs and start learning today.</p>
                <Link href="/courses">
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90">Explore Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {enrolledCourses.map((course) => {
                const cat = getCategoryInfo(course.category);
                const done = course.progress >= 90;
                return (
                  <Card key={course.id} className="card-hover group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:border-primary/30">
                    <Link href={`/courses/${course.id}`} className="block">
                      <div className="aspect-video relative bg-muted overflow-hidden">
                        {course.image ? (
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                            <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-primary/50" />
                          </div>
                        )}
                        
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        <div className="absolute top-2.5 right-2.5">
                          <Badge className={`${done ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'} shadow-md text-xs`}>
                            {done ? 'Completed' : `${course.progress}% Complete`}
                          </Badge>
                        </div>
                        
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white text-xs font-medium drop-shadow">
                          <span className={`px-2 py-0.5 rounded-full ${cat.cls} !text-[11px]`}>{cat.label}</span>
                        </div>
                      </div>
                    </Link>
                    
                    <CardContent className="p-3.5 sm:p-5">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1.5 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-4">
                        <User className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        By {course.teacherName}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Layers className="h-3.5 w-3.5 text-primary" />
                            {course.completedClasses}/{course.totalClasses} classes
                          </span>
                          <span className="font-semibold text-foreground">{course.progress}%</span>
                        </div>
                        <Progress 
                          value={course.progress} 
                          className="h-2.5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/70" 
                        />
                      </div>
                      
                      {done ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300"
                          onClick={() => setCertificateCourse(course)}
                        >
                          <Award className="h-3.5 w-3.5 mr-1.5" /> View Certificate
                        </Button>
                      ) : (
                        <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90">
                          <Link href={`/courses/${course.id}`}>
                            Continue Learning <ArrowRight className="h-3.5 w-3.5 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4 sm:space-y-6">
          {/* Live Classes Section */}
          <LiveClassViewer 
            studentId={studentId} 
            enrolledCourses={enrolledCourses.map(course => course.id)}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Course Meetings</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Scheduled sessions for your enrolled courses</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Badge variant="outline" className="text-primary text-xs sm:text-sm">
                {meetings.filter(m => m.status === 'scheduled').length} Upcoming
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchMeetings}
                disabled={loading}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <Timer className="h-3.5 w-3.5 mr-1.5" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <Card 
                  key={meeting.id} 
                  className={`overflow-hidden rounded-2xl bg-card shadow-sm border border-border/60 border-l-4 ${
                    meeting.status === 'live' ? 'border-l-red-500 bg-red-500/[0.03]' : 
                    meeting.status === 'scheduled' ? 'border-l-primary' : 'border-l-muted-foreground/20'
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex-shrink-0">
                            {meeting.course?.image ? (
                              <Image
                                src={meeting.course.image}
                                alt={meeting.course.title}
                                width={48}
                                height={48}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border shadow-sm">
                                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-primary/60" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground line-clamp-1">{meeting.topic}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {meeting.course?.title || meeting.courseTitle}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              by {meeting.teacherName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span className="whitespace-nowrap">
                              {new Date(meeting.scheduledAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span className="whitespace-nowrap">
                              {new Date(meeting.scheduledAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} ({meeting.duration}min)
                            </span>
                          </div>
                          <Badge 
                            variant={meeting.status === 'live' ? 'destructive' : 
                                    meeting.status === 'scheduled' ? 'default' : 
                                    'outline'}
                            className={`text-xs ${meeting.status === 'live' ? 'animate-pulse' : ''}`}
                          >
                            {meeting.status === 'live' ? '🔴 Live' : 
                             meeting.status === 'scheduled' ? '📅 Scheduled' : 
                             '✅ Completed'}
                          </Badge>
                        </div>

                        {meeting.description && (
                          <div className="bg-muted/70 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 border border-border/40">
                            <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Meeting Description:</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {meeting.description}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:min-w-[180px]">
                        {meeting.status === 'live' && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg text-xs sm:text-sm"
                            onClick={() => meetingJoinUrl(meeting) && window.open(meetingJoinUrl(meeting), '_blank')}
                          >
                            <Video className="h-3.5 w-3.5 mr-1.5" />
                            <span className="hidden sm:inline">Join Live Class</span>
                            <span className="sm:hidden">Join Live</span>
                          </Button>
                        )}
                        
                        {meeting.status === 'scheduled' && (
                          <Button
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() => meetingJoinUrl(meeting) && window.open(meetingJoinUrl(meeting), '_blank')}
                          >
                            <Video className="h-3.5 w-3.5 mr-1.5" />
                            <span className="hidden sm:inline">Join Meeting</span>
                            <span className="sm:hidden">Join</span>
                          </Button>
                        )}
                        
                        {meetingJoinUrl(meeting) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() => meetingJoinUrl(meeting) && copyToClipboard(meetingJoinUrl(meeting), meeting.id)}
                          >
                            {copiedUrls.has(meeting.id) ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                                <span className="hidden sm:inline">Copied!</span>
                                <span className="sm:hidden">✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                <span className="hidden sm:inline">Copy Link</span>
                                <span className="sm:hidden">Copy</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10">
                    <Video className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5">No meetings scheduled</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Your teachers will schedule meetings for your enrolled courses.
                  </p>
                  <div className="bg-muted/70 p-3 sm:p-4 rounded-xl text-left max-w-md mx-auto border border-border/40">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 bg-primary/10 p-1 rounded-full flex-shrink-0">
                        <Star className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-xs sm:text-sm text-foreground">
                        <span className="font-medium">Tip:</span> Meetings will appear here automatically when teachers schedule them for your enrolled courses.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Payment History</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Your enrollment transactions</p>
            </div>
            <Badge variant="outline" className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
              {payments.length} Transaction{payments.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <Card 
                  key={payment.id} 
                  className="rounded-2xl overflow-hidden bg-card shadow-sm border border-border/60 border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex-shrink-0">
                            {payment.course?.image ? (
                              <Image
                                src={payment.course.image}
                                alt={payment.course.title}
                                width={48}
                                height={48}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-sm">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-xl text-foreground line-clamp-2">
                              {payment.course?.title || payment.courseTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                              {payment.course?.category?.replace('-', ' ') || 'Course Enrollment'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span className="whitespace-nowrap">
                              {new Date(payment.completedAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span className="whitespace-nowrap">
                              {new Date(payment.completedAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            {payment.status === 'completed' ? 'Completed' : payment.status}
                          </Badge>
                        </div>

                        <div className="bg-muted/70 rounded-xl p-3 sm:p-4 text-xs sm:text-sm border border-border/40">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                              <span className="text-muted-foreground">Payment ID:</span>
                              <p className="font-mono text-xs sm:text-sm text-foreground break-all">{payment.paymentId}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Order ID:</span>
                              <p className="font-mono text-xs sm:text-sm text-foreground break-all">{payment.orderId}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right min-w-[120px] sm:min-w-[180px] w-full sm:w-auto">
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{payment.currency}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 sm:mt-3 text-green-600 dark:text-green-400 text-xs sm:text-sm w-full sm:w-auto border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => {
                            // Generate a simple receipt
                            const receiptData = `
                              YUVABOT LAB - PAYMENT RECEIPT
                              ================================
                              Course: ${payment.course?.title || payment.courseTitle}
                              Amount: ₹${payment.amount.toLocaleString()}
                              Payment ID: ${payment.paymentId}
                              Order ID: ${payment.orderId}
                              Date: ${new Date(payment.completedAt).toLocaleDateString()}
                              Status: ${payment.status}
                            `;
                            navigator.clipboard.writeText(receiptData);
                            toast.success("Receipt copied to clipboard!");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                    <span className="text-xl sm:text-2xl">💳</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5">No payments yet</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Your payment history will appear here after you enroll in courses.
                  </p>
                  <div className="bg-muted/70 p-3 sm:p-4 rounded-xl text-left max-w-md mx-auto border border-border/40">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 bg-emerald-500/10 p-1 rounded-full flex-shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-foreground">
                        <span className="font-medium">Secure Payments:</span> All payments are processed securely through Razorpay with 256-bit SSL encryption.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {payments.length > 0 && (
            <Card className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-2.5 sm:p-3 rounded-xl border border-emerald-500/20 flex-shrink-0">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                      <span className="text-white text-lg font-extrabold">₹</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="font-semibold text-foreground text-base sm:text-lg mb-3 flex items-center gap-2">
                      Payment Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="rounded-xl border border-border/50 bg-background p-3 shadow-sm">
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1.5" />
                        <span className="text-muted-foreground block">Total Paid</span>
                        <p className="font-bold text-foreground text-sm sm:text-base">
                          ₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-background p-3 shadow-sm">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1.5" />
                        <span className="text-muted-foreground block">Courses Purchased</span>
                        <p className="font-bold text-foreground text-sm sm:text-base">{payments.length}</p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-background p-3 shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400 mb-1.5" />
                        <span className="text-muted-foreground block">Payment Method</span>
                        <p className="font-bold text-foreground text-sm sm:text-base">Razorpay (Secure)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Account Details */}
            <Card className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  Account Details
                </CardTitle>
                <CardDescription className="text-primary-foreground/70 text-xs sm:text-sm mt-1.5">
                  Your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {session?.user?.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      {session?.user?.name || "Student"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="bg-muted/70 rounded-xl border border-border/40 divide-y divide-border/40">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">Role</span>
                    <Badge variant="outline" className="text-primary text-xs">Student</Badge>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">Student ID</span>
                    <span className="font-mono text-xs sm:text-sm text-foreground">{studentId}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">Enrolled Courses</span>
                    <span className="font-semibold text-sm sm:text-base text-foreground">{stats.totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">Certificates</span>
                    <span className="font-semibold text-sm sm:text-base text-foreground">{stats.certificates}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  Change Password
                </CardTitle>
                <CardDescription className="text-primary-foreground/70 text-xs sm:text-sm mt-1.5">
                  Keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs sm:text-sm text-muted-foreground">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs sm:text-sm text-muted-foreground">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm text-muted-foreground">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90"
                  >
                    {updatingPassword ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Dialog */}
      <Dialog open={!!certificateCourse} onOpenChange={(open) => !open && setCertificateCourse(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Certificate
            </DialogTitle>
            <DialogDescription>
              {certificateCourse?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/10 p-6 sm:p-8 text-center">
            <Award className="h-12 w-12 mx-auto text-primary/40 mb-3" />
            <p className="font-semibold text-foreground mb-1">Certificate Preview</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your completion certificate for{" "}
              <span className="font-medium text-foreground">{certificateCourse?.title}</span>{" "}
              will be available here soon.
            </p>
            <Badge variant="outline" className="mt-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
              Coming soon from admin panel
            </Badge>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateCourse(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
}