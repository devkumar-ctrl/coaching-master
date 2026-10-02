"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  BookOpen,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    totalEnrollments: number;
    growthRates: {
      users: number;
      courses: number;
      revenue: number;
      enrollments: number;
    };
  };
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userRetentionRate: number;
    usersByRole: {
      students: number;
      teachers: number;
      admins: number;
    };
    userGrowthTrend: Array<{
      month: string;
      users: number;
      students: number;
      teachers: number;
    }>;
  };
  courseMetrics: {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    averageCourseRating: number;
    courseCompletionRate: number;
    popularCategories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    coursePerformance: Array<{
      courseId: string;
      title: string;
      enrollments: number;
      revenue: number;
      rating: number;
    }>;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
    revenueGrowthRate: number;
    revenueByMonth: Array<{
      month: string;
      revenue: number;
      enrollments: number;
    }>;
    topEarningTeachers: Array<{
      teacherId: string;
      name: string;
      revenue: number;
      courses: number;
    }>;
  };
  engagementMetrics: {
    averageSessionDuration: number;
    coursesPerStudent: number;
    averageRating: number;
    reviewCount: number;
    activeStudentsThisMonth: number;
    courseCompletionRate: number;
  };
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/adm_n/login");
    } else if (session.user?.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchAnalytics();
    }
  }, [session, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (rate: number) => {
    return rate >= 0 ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (rate: number) => {
    return rate >= 0 ? "text-green-600" : "text-red-600";
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Comprehensive platform insights and metrics."
        actions={
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics?.overview.totalUsers?.toLocaleString() || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(analytics?.overview.growthRates.users || 0)}
                  <p className={`text-xs ${getGrowthColor(analytics?.overview.growthRates.users || 0)}`}>
                    {formatPercentage(analytics?.overview.growthRates.users || 0)}
                  </p>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{analytics?.overview.totalCourses || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(analytics?.overview.growthRates.courses || 0)}
                  <p className={`text-xs ${getGrowthColor(analytics?.overview.growthRates.courses || 0)}`}>
                    {formatPercentage(analytics?.overview.growthRates.courses || 0)}
                  </p>
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics?.overview.totalRevenue || 0)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(analytics?.overview.growthRates.revenue || 0)}
                  <p className={`text-xs ${getGrowthColor(analytics?.overview.growthRates.revenue || 0)}`}>
                    {formatPercentage(analytics?.overview.growthRates.revenue || 0)}
                  </p>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{analytics?.overview.totalEnrollments?.toLocaleString() || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(analytics?.overview.growthRates.enrollments || 0)}
                  <p className={`text-xs ${getGrowthColor(analytics?.overview.growthRates.enrollments || 0)}`}>
                    {formatPercentage(analytics?.overview.growthRates.enrollments || 0)}
                  </p>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Health
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="font-medium">{analytics?.userMetrics.activeUsers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Completion Rate</span>
                  <span className="font-medium">{analytics?.courseMetrics.courseCompletionRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Course Rating</span>
                  <span className="font-medium">{analytics?.courseMetrics.averageCourseRating?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Retention Rate</span>
                  <span className="font-medium">{analytics?.userMetrics.userRetentionRate?.toFixed(1) || 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Distribution
                </CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Students</span>
                    </div>
                    <span className="font-medium">{analytics?.userMetrics.usersByRole.students || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-sm">Teachers</span>
                    </div>
                    <span className="font-medium">{analytics?.userMetrics.usersByRole.teachers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span className="text-sm">Admins</span>
                    </div>
                    <span className="font-medium">{analytics?.userMetrics.usersByRole.admins || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New Users This Month</p>
                    <p className="text-2xl font-bold">{analytics?.userMetrics.newUsersThisMonth || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{analytics?.userMetrics.activeUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-bold">{analytics?.userMetrics.userRetentionRate?.toFixed(1) || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>User acquisition over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LineChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">User growth chart would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Integration with charting library needed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published Courses</p>
                    <p className="text-2xl font-bold">{analytics?.courseMetrics.publishedCourses || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{analytics?.courseMetrics.courseCompletionRate?.toFixed(1) || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{analytics?.courseMetrics.averageCourseRating?.toFixed(1) || 0}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Course distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.courseMetrics.popularCategories?.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No category data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>Courses by enrollment and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.courseMetrics.coursePerformance?.slice(0, 5).map((course, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {course.enrollments} enrollments
                        </span>
                        <span className="text-xs font-medium">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No course performance data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics?.revenueMetrics.monthlyRevenue || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics?.revenueMetrics.averageOrderValue || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold">{formatPercentage(analytics?.revenueMetrics.revenueGrowthRate || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Earning Teachers</CardTitle>
              <CardDescription>Teachers generating the most revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.revenueMetrics.topEarningTeachers?.slice(0, 5).map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <h4 className="font-medium">{teacher.name}</h4>
                      <p className="text-sm text-muted-foreground">{teacher.courses} courses</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(teacher.revenue)}</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No teacher revenue data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Courses per Student</p>
                    <p className="text-2xl font-bold">{analytics?.engagementMetrics.coursesPerStudent?.toFixed(1) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{analytics?.engagementMetrics.averageRating?.toFixed(1) || 0}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{analytics?.engagementMetrics.reviewCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Summary</CardTitle>
              <CardDescription>Platform engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Students This Month</span>
                    <span className="font-medium">{analytics?.engagementMetrics.activeStudentsThisMonth || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course Completion Rate</span>
                    <span className="font-medium">{analytics?.engagementMetrics.courseCompletionRate?.toFixed(1) || 0}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Session Duration</span>
                    <span className="font-medium">{analytics?.engagementMetrics.averageSessionDuration || 0} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Reviews</span>
                    <span className="font-medium">{analytics?.engagementMetrics.reviewCount || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
