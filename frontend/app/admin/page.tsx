"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  FilePenLine,
  Star,
  UserPlus,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/page-header";

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  totalReviews: number;
  averageRating: number;
  pendingRequests: number;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  status: string;
  price: number;
  image?: string | null;
  teacherName?: string;
  teacherImage?: string | null;
  createdAt: string;
}

interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  status: string;
  createdAt: string;
}

const ACTIVITY_BADGES: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  user_registered: {
    label: "User",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <UserPlus className="h-3 w-3" />,
  },
  course_created: {
    label: "Course",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <BookOpen className="h-3 w-3" />,
  },
  payment_received: {
    label: "Payment",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <DollarSign className="h-3 w-3" />,
  },
};

const inr = (n: number) =>
  "₹" + (n || 0).toLocaleString("en-IN");

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/adm_n/login");
    } else if (session.user?.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, testiRes, requestsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/courses"),
        fetch("/api/testimonials?admin=true&status=pending"),
        fetch("/api/admin/teacher-applications"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data && typeof data.totalUsers === "number") {
          setStats(data);
        }
      }
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(
          (Array.isArray(data) ? data : [])
            .map((c: Course) => ({ ...c, createdAt: c.createdAt || "" }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
      }
      if (testiRes.ok) {
        const data = await testiRes.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setPendingRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchData();
    }
  }, [session, fetchData]);

  const handleTestimonialAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success(action === "approve" ? "Testimonial approved" : "Testimonial rejected");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Revenue (this month)",
      value: inr(stats?.thisMonthRevenue || 0),
      hint: `${inr(stats?.totalRevenue || 0)} lifetime`,
      icon: <DollarSign className="h-4 w-4 text-emerald-600" />,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Enrollments",
      value: (stats?.totalEnrollments || 0).toLocaleString("en-IN"),
      hint: "Across all courses",
      icon: <GraduationCap className="h-4 w-4 text-blue-600" />,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Users",
      value: (stats?.totalUsers || 0).toLocaleString("en-IN"),
      hint: `${stats?.totalStudents || 0} students · ${stats?.totalTeachers || 0} teachers`,
      icon: <Users className="h-4 w-4 text-violet-600" />,
      iconBg: "bg-violet-50 text-violet-600",
    },
    {
      label: "Courses",
      value: (stats?.totalCourses || 0).toLocaleString("en-IN"),
      hint: `${stats?.publishedCourses || 0} live on the site`,
      icon: <BookOpen className="h-4 w-4 text-purple-600" />,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      label: "Drafts",
      value: (stats?.draftCourses || 0).toLocaleString("en-IN"),
      hint: "Awaiting publishing",
      icon: <FilePenLine className="h-4 w-4 text-amber-600" />,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Avg. Rating",
      value: (stats?.averageRating || 0).toFixed(1),
      hint: `${stats?.totalReviews || 0} reviews`,
      icon: <Star className="h-4 w-4 text-yellow-600" />,
      iconBg: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Welcome back — here is what is happening on your platform."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/courses">
              <BookOpen className="h-4 w-4" />
              Manage Courses
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <Card key={card.label} className="border">
            <CardContent className="p-4">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
              <p className="text-xl font-bold leading-tight">{card.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </div>
            <Badge variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              Live feed
            </Badge>
          </CardHeader>
          <CardContent>
            {!stats?.recentActivity?.length ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No activity yet.
              </p>
            ) : (
              <ul className="divide-y">
                {stats.recentActivity.slice(0, 8).map((activity, index) => {
                  const lookup = ACTIVITY_BADGES[activity.type] || ACTIVITY_BADGES.user_registered;
                  return (
                    <li
                      key={`${activity.type}-${activity.timestamp}-${index}`}
                      className="flex items-start gap-3 py-3"
                    >
                      <Badge className={`mt-0.5 gap-1 border font-medium ${lookup.className}`}>
                        {lookup.icon}
                        {lookup.label}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          ·{" "}
                          {new Date(activity.timestamp).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Latest Courses</CardTitle>
              <CardDescription>Recently added or updated</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!courses.length ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No courses yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {courses.map((course) => (
                  <li key={course._id} className="flex items-center gap-3">
                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {course.image ? (
                        <img src={course.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{course.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {course.category} · {inr(course.price)}
                      </p>
                    </div>
                    <Badge
                      variant={course.status === "published" ? "default" : "secondary"}
                      className={course.status === "published" ? "bg-emerald-600" : undefined}
                    >
                      {course.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="ghost" size="sm" className="mt-4 w-full gap-1 text-muted-foreground">
              <Link href="/admin/courses">
                View all courses
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Pending Testimonials
                </CardTitle>
                <CardDescription>Reviews waiting for your approval</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link href="/admin/testimonials">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!testimonials.length ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-500/60" />
                  <p className="text-sm text-muted-foreground">
                    No testimonials waiting for review.
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {testimonials.map((testimonial) => (
                    <li key={testimonial._id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{testimonial.name}</p>
                          <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                            <Star className="h-3 w-3 fill-current" />
                            {testimonial.rating}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                          {testimonial.content}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:text-red-600"
                          onClick={() => handleTestimonialAction(testimonial._id, "reject")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleTestimonialAction(testimonial._id, "approve")}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Teacher Applications
              </CardTitle>
              <CardDescription>People requesting to teach</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href="/admin/request">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!pendingRequests.length ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <LayoutDashboard className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No new applications.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {pendingRequests.slice(0, 5).map((request, index) => (
                  <li key={request._id || index} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={request.image} />
                      <AvatarFallback>{request.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{request.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {request.specialization?.join(", ") || request.qualification || request.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-amber-700">
                      Pending
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}